module scholarship_platform::scholarship {
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_std::table::{Self, Table};
    use aptos_std::simple_map::{Self, SimpleMap};

    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EINSUFFICIENT_FUNDS: u64 = 2;
    const EINVALID_AMOUNT: u64 = 3;
    const EINVALID_CRITERIA: u64 = 4;
    const ESCHOLARSHIP_NOT_FOUND: u64 = 5;
    const EALREADY_APPLIED: u64 = 6;
    const ENOT_ELIGIBLE: u64 = 7;

    // Structs
    struct Scholarship has key, store {
        id: u64,
        provider: address,
        amount: u64,
        studying_level: vector<u8>,
        caste: vector<u8>,
        annual_income: u64,
        cgpa: u64,
        ssc_score: u64,
        is_active: bool,
        created_at: u64,
        applications: vector<address>
    }

    struct Application has key, store {
        applicant: address,
        scholarship_id: u64,
        studying_level: u8,
        caste: vector<u8>,
        annual_income: u64,
        cgpa: u64,
        ssc_score: u64,
        status: u8, // 0: Pending, 1: Approved, 2: Rejected
        applied_at: u64
    }

    struct ScholarshipPlatform has key {
        scholarships: Table<u64, Scholarship>,
        applications: Table<address, vector<u64>>,
        next_scholarship_id: u64,
        platform_wallet: address,
        total_funds: u64
    }

    // Events
    struct ScholarshipCreatedEvent has drop, store {
        scholarship_id: u64,
        provider: address,
        amount: u64,
        timestamp: u64
    }

    struct ApplicationSubmittedEvent has drop, store {
        application_id: address,
        scholarship_id: u64,
        applicant: address,
        timestamp: u64
    }

    struct ScholarshipAwardedEvent has drop, store {
        scholarship_id: u64,
        applicant: address,
        amount: u64,
        timestamp: u64
    }

    // Capabilities
    struct PlatformCapability has key {
        platform: address
    }

    // Initialize the platform
    fun init_module(account: &signer) {
        let platform_addr = signer::address_of(account);
        
        move_to(account, ScholarshipPlatform {
            scholarships: table::new(),
            applications: table::new(),
            next_scholarship_id: 0,
            platform_wallet: platform_addr,
            total_funds: 0
        });

        move_to(account, PlatformCapability {
            platform: platform_addr
        });
    }

    // Create a new scholarship
    public entry fun create_scholarship(
        provider: &signer,
        amount: u64,
        studying_level: vector<u8>,
        caste: vector<u8>,
        annual_income: u64,
        cgpa: u64,
        ssc_score: u64
    ) acquires ScholarshipPlatform {
        let provider_addr = signer::address_of(provider);
        let platform = borrow_global_mut<ScholarshipPlatform>(@scholarship_platform);
        
        // Validate criteria
        assert!(cgpa <= 1000, EINVALID_CRITERIA); // CGPA * 100 to avoid decimals
        assert!(ssc_score <= 600, EINVALID_CRITERIA);
        assert!(amount > 0, EINVALID_AMOUNT);

        let scholarship_id = platform.next_scholarship_id;
        platform.next_scholarship_id = platform.next_scholarship_id + 1;

        let scholarship = Scholarship {
            id: scholarship_id,
            provider: provider_addr,
            amount,
            studying_level,
            caste,
            annual_income,
            cgpa,
            ssc_score,
            is_active: true,
            created_at: timestamp::now_seconds(),
            applications: vector::empty()
        };

        table::add(&mut platform.scholarships, scholarship_id, scholarship);
        
        // Transfer funds from provider to platform
        let platform_cap = borrow_global<PlatformCapability>(@scholarship_platform);
        let provider_coins = coin::withdraw<AptosCoin>(provider, amount);
        coin::deposit(platform_cap.platform, provider_coins);
        platform.total_funds = platform.total_funds + amount;

        // Emit event
        event::emit(ScholarshipCreatedEvent {
            scholarship_id,
            provider: provider_addr,
            amount,
            timestamp: timestamp::now_seconds()
        });
    }

    // Apply for a scholarship
    public entry fun apply_for_scholarship(
        applicant: &signer,
        scholarship_id: u64,
        studying_level: u8,
        caste: vector<u8>,
        annual_income: u64,
        cgpa: u64,
        ssc_score: u64
    ) acquires ScholarshipPlatform {
        let applicant_addr = signer::address_of(applicant);
        let platform = borrow_global_mut<ScholarshipPlatform>(@scholarship_platform);
        
        // Check if scholarship exists and is active
        assert!(table::contains(&platform.scholarships, scholarship_id), ESCHOLARSHIP_NOT_FOUND);
        let scholarship = table::borrow(&platform.scholarships, scholarship_id);
        assert!(scholarship.is_active, ESCHOLARSHIP_NOT_FOUND);

        // Check if already applied
        let applicant_applications = if (table::contains(&platform.applications, applicant_addr)) {
            table::borrow_mut(&platform.applications, applicant_addr)
        } else {
            table::add(&mut platform.applications, applicant_addr, vector::empty());
            table::borrow_mut(&platform.applications, applicant_addr)
        };

        // Check if already applied to this scholarship
        let i = 0;
        let len = vector::length(applicant_applications);
        while (i < len) {
            if (*vector::borrow(applicant_applications, i) == scholarship_id) {
                abort EALREADY_APPLIED
            };
            i = i + 1;
        };

        // Validate eligibility
        let is_eligible = check_eligibility(
            scholarship,
            studying_level,
            &caste,
            annual_income,
            cgpa,
            ssc_score
        );

        let status = if (is_eligible) { 1 } else { 2 }; // 1: Approved, 2: Rejected

        let application = Application {
            applicant: applicant_addr,
            scholarship_id,
            studying_level,
            caste,
            annual_income,
            cgpa,
            ssc_score,
            status,
            applied_at: timestamp::now_seconds()
        };

        // Add application to scholarship
        let scholarship = table::borrow_mut(&mut platform.scholarships, scholarship_id);
        vector::push_back(&mut scholarship.applications, applicant_addr);

        // Add scholarship to applicant's applications
        vector::push_back(applicant_applications, scholarship_id);

        // If eligible, award the scholarship
        if (is_eligible) {
            award_scholarship(platform, scholarship_id, applicant_addr);
        };

        // Emit event
        event::emit(ApplicationSubmittedEvent {
            application_id: applicant_addr,
            scholarship_id,
            applicant: applicant_addr,
            timestamp: timestamp::now_seconds()
        });
    }

    // Check eligibility based on criteria
    fun check_eligibility(
        scholarship: &Scholarship,
        studying_level: u8,
        caste: &vector<u8>,
        annual_income: u64,
        cgpa: u64,
        ssc_score: u64
    ): bool {
        // Check studying level
        let level_match = false;
        let i = 0;
        let len = vector::length(&scholarship.studying_level);
        while (i < len) {
            if (*vector::borrow(&scholarship.studying_level, i) == studying_level) {
                level_match = true;
                break
            };
            i = i + 1;
        };
        if (!level_match) return false;

        // Check caste
        let caste_match = false;
        let i = 0;
        let len = vector::length(caste);
        while (i < len) {
            let j = 0;
            let scholarship_caste_len = vector::length(&scholarship.caste);
            while (j < scholarship_caste_len) {
                if (*vector::borrow(caste, i) == *vector::borrow(&scholarship.caste, j)) {
                    caste_match = true;
                    break
                };
                j = j + 1;
            };
            if (caste_match) break;
            i = i + 1;
        };
        if (!caste_match) return false;

        // Check annual income
        if (annual_income > scholarship.annual_income) return false;

        // Check CGPA (multiply by 100 to avoid decimals)
        if (cgpa > scholarship.cgpa) return false;

        // Check SSC score
        if (ssc_score > scholarship.ssc_score) return false;

        true
    }

    // Award scholarship to applicant
    fun award_scholarship(
        platform: &mut ScholarshipPlatform,
        scholarship_id: u64,
        applicant_addr: address
    ) {
        let scholarship = table::borrow_mut(&mut platform.scholarships, scholarship_id);
        let amount = scholarship.amount;

        // Transfer funds from platform to applicant
        let platform_cap = borrow_global<PlatformCapability>(@scholarship_platform);
        let platform_coins = coin::withdraw<AptosCoin>(&account::create_signer_with_capability(&account::create_test_signer_cap(platform_cap.platform)), amount);
        coin::deposit(applicant_addr, platform_coins);
        
        platform.total_funds = platform.total_funds - amount;

        // Emit event
        event::emit(ScholarshipAwardedEvent {
            scholarship_id,
            applicant: applicant_addr,
            amount,
            timestamp: timestamp::now_seconds()
        });
    }

    // Get scholarship details
    public fun get_scholarship(scholarship_id: u64): Scholarship acquires ScholarshipPlatform {
        let platform = borrow_global<ScholarshipPlatform>(@scholarship_platform);
        assert!(table::contains(&platform.scholarships, scholarship_id), ESCHOLARSHIP_NOT_FOUND);
        *table::borrow(&platform.scholarships, scholarship_id)
    }

    // Get all active scholarships
    public fun get_active_scholarships(): vector<u64> acquires ScholarshipPlatform {
        let platform = borrow_global<ScholarshipPlatform>(@scholarship_platform);
        let active_ids = vector::empty<u64>();
        let i = 0;
        while (i < platform.next_scholarship_id) {
            if (table::contains(&platform.scholarships, i)) {
                let scholarship = table::borrow(&platform.scholarships, i);
                if (scholarship.is_active) {
                    vector::push_back(&mut active_ids, i);
                };
            };
            i = i + 1;
        };
        active_ids
    }

    // Get applicant's applications
    public fun get_applicant_applications(applicant_addr: address): vector<u64> acquires ScholarshipPlatform {
        let platform = borrow_global<ScholarshipPlatform>(@scholarship_platform);
        if (table::contains(&platform.applications, applicant_addr)) {
            *table::borrow(&platform.applications, applicant_addr)
        } else {
            vector::empty<u64>()
        }
    }

    // Get platform total funds
    public fun get_platform_funds(): u64 acquires ScholarshipPlatform {
        let platform = borrow_global<ScholarshipPlatform>(@scholarship_platform);
        platform.total_funds
    }
}


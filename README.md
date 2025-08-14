# Scholarship Platform

A blockchain-based scholarship platform built with React, Aptos blockchain, and Move smart contracts. This platform connects scholarship providers with eligible students through transparent and secure smart contracts.

## Features

### For Scholarship Providers
- **Wallet Connection**: Connect with Petra wallet using the specified provider key
- **Fund Deposit**: Deposit scholarship funds to the platform wallet
- **Eligibility Criteria**: Set comprehensive eligibility requirements including:
  - Education level (Matriculation, Intermediate, Under Graduation, Post Graduation)
  - Caste categories (OC, BC, SC, CT)
  - Annual income limits
  - CGPA requirements (0-10 scale)
  - SSC score limits (0-600)
- **Data Storage**: Scholarship data stored in Pinata IPFS for decentralization

### For Scholarship Applicants
- **Wallet Connection**: Connect with Petra wallet using the specified applicant key
- **Scholarship Discovery**: Browse all available scholarships
- **Smart Eligibility Check**: Automatic verification through smart contracts
- **Application Tracking**: Monitor application status (Active, Approved, Rejected)
- **Instant Rewards**: Automatic scholarship distribution upon eligibility confirmation

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Ant Design (antd)
- **Blockchain**: Aptos blockchain with Move smart contracts
- **Wallet**: Petra wallet integration
- **Storage**: Pinata IPFS integration
- **Styling**: CSS3 with modern design patterns

## Smart Contract Details

The platform uses a Move smart contract (`scholarship.move`) that handles:
- Scholarship creation and management
- Automatic eligibility verification
- Fund distribution
- Application tracking
- Event emission for transparency

### Contract Addresses
- **Platform Wallet**: `0x74b5179e5a25a09620e85ffe50d1e06040e916e343fc7c2363321b379ce5ca19`
- **Provider Key**: `0xc2caa68f26fd69ece51468121283739a8937d6e2e1db3181c76212bda07fbf7d`
- **Applicant Key**: `0xe8927d82bfc052515e1ec2cd59121c0ee4383c535f13750f2070022d706cff6e`

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Petra wallet extension installed
- Aptos testnet account with test tokens

### 1. Clone the Repository
```bash
git clone <repository-url>
cd scholarship-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## Usage Guide

### For Scholarship Providers

1. **Access the Platform**
   - Visit the landing page
   - Click "Become a Provider"

2. **Connect Wallet**
   - Connect your Petra wallet
   - Ensure you're using the correct provider key

3. **Deposit Funds**
   - Enter the scholarship amount in APT
   - Confirm the transaction

4. **Set Requirements**
   - Define education level eligibility
   - Set caste category requirements
   - Specify income, CGPA, and SSC score limits
   - Save requirements to Pinata IPFS

### For Scholarship Applicants

1. **Access the Platform**
   - Visit the landing page
   - Click "Apply for Scholarships"

2. **Connect Wallet**
   - Connect your Petra wallet
   - Ensure you're using the correct applicant key

3. **Browse Scholarships**
   - View all available scholarships
   - Check eligibility criteria

4. **Apply for Scholarships**
   - Select your education level
   - Provide personal details
   - Submit application for smart contract verification

5. **Track Applications**
   - Monitor application status
   - View approved/rejected applications
   - Track total awarded amounts

## Smart Contract Deployment

### 1. Install Aptos CLI
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

### 2. Initialize Aptos Project
```bash
aptos init --profile default
```

### 3. Deploy Smart Contract
```bash
aptos move publish --named-addresses scholarship_platform=<your-address>
```

## Pinata Integration

The platform integrates with Pinata IPFS for decentralized data storage:

- **Gateway**: `crimson-immediate-worm-949.mypinata.cloud`
- **Data Types**: Scholarship requirements, application data
- **Benefits**: Decentralized storage, censorship resistance, data permanence

## Security Features

- **Wallet Verification**: Ensures correct wallet addresses for providers and applicants
- **Smart Contract Validation**: Automatic eligibility checks through blockchain
- **Fund Security**: Secure fund handling through platform wallet
- **Transparent Transactions**: All operations recorded on blockchain

## Testing

### Run Tests
```bash
npm test
```

### Test Smart Contracts
```bash
aptos move test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Integration with educational institutions
- [ ] Automated KYC verification
- [ ] Advanced smart contract features

## Acknowledgments

- Aptos Labs for blockchain infrastructure
- Ant Design for UI components
- Pinata for IPFS services
- React community for frontend framework


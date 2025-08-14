import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import { 
  Card, 
  Radio, 
  Checkbox, 
  InputNumber, 
  Button, 
  Typography, 
  Space, 
  message, 
  Steps,
  Result,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  DollarOutlined
} from '@ant-design/icons';
import './ScholarshipApplication.css';

const { Title, Text, Paragraph } = Typography;

const { Step } = Steps;

interface Scholarship {
  id: number;
  providerAddress: string;
  amount: number;
  studyingLevel: string[];
  caste: string[];
  annualIncome: number;
  cgpa: number;
  sscScore: number;
  platformWallet: string;
  timestamp: string;
  type: string;
}

interface LocationState {
  scholarship: Scholarship;
}

const ScholarshipApplication: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { account, applicantKey } = useWalletContext();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<boolean | null>(null);
  
  // Form state
  const [studyingLevel, setStudyingLevel] = useState<string>('');
  const [caste, setCaste] = useState<string[]>([]);
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [sscScore, setSscScore] = useState<number | null>(null);

  const state = location.state as LocationState;
  const scholarship = state?.scholarship;

  useEffect(() => {
    if (!scholarship) {
      message.error('Scholarship not found');
      navigate('/scholarships/active');
    }
  }, [scholarship, navigate]);

  const studyingOptions = [
    { label: 'Matriculation', value: 'matriculation' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Under Graduation', value: 'undergraduation' },
    { label: 'Post Graduation', value: 'postgraduation' }
  ];

  const casteOptions = [
    { label: 'OC (Other Castes)', value: 'oc' },
    { label: 'BC (Backward Classes)', value: 'bc' },
    { label: 'SC (Scheduled Castes)', value: 'sc' },
    { label: 'CT (Caste Tribe)', value: 'ct' }
  ];

  const validateFirstStep = (): boolean => {
    if (!studyingLevel) {
      message.error('Please select your education level');
      return false;
    }
    return true;
  };

  const validateSecondStep = (): boolean => {
    if (caste.length === 0) {
      message.error('Please select at least one caste category');
      return false;
    }
    if (!annualIncome || annualIncome <= 0) {
      message.error('Please enter a valid annual income');
      return false;
    }
    if (!cgpa || cgpa <= 0 || cgpa > 10) {
      message.error('CGPA must be between 0 and 10');
      return false;
    }
    if (!sscScore || sscScore <= 0 || sscScore > 600) {
      message.error('SSC score must be between 0 and 600');
      return false;
    }
    return true;
  };

  const checkEligibility = (): boolean => {
    // Check studying level
    if (!scholarship.studyingLevel.includes(studyingLevel)) {
      return false;
    }

    // Check caste
    const hasMatchingCaste = caste.some(c => scholarship.caste.includes(c));
    if (!hasMatchingCaste) {
      return false;
    }

    // Check annual income
    if (annualIncome! > scholarship.annualIncome) {
      return false;
    }

    // Check CGPA
    if (cgpa! < scholarship.cgpa) {
      return false;
    }

    // Check SSC score
    if (sscScore! > scholarship.sscScore) {
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (validateFirstStep()) {
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      if (validateSecondStep()) {
        processApplication();
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const processApplication = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate smart contract execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isEligible = checkEligibility();
      setEligibilityResult(isEligible);
      
      if (isEligible) {
        // Store application in localStorage
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const newApplication = {
          id: Date.now(),
          scholarshipId: scholarship.id,
          applicantAddress: account,
          studyingLevel,
          caste,
          annualIncome,
          cgpa,
          sscScore,
          status: 'Approved',
          timestamp: new Date().toISOString(),
          amount: scholarship.amount
        };
        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        message.success('Congratulations! You are eligible for this scholarship.');
      } else {
        message.error('Sorry, you are not eligible for this scholarship.');
      }
      
      setCurrentStep(2);
    } catch (error) {
      message.error('Failed to process application');
      console.error('Application error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToScholarships = () => {
    navigate('/scholarships/active');
  };

  const handleViewApplications = () => {
    navigate('/scholarships/applied');
  };

  if (!scholarship) {
    return null;
  }

  const steps = [
    {
      title: 'Education Level',
      content: (
        <div className="step-content">
          <Title level={3}>What is your current education level?</Title>
          <Text type="secondary">
            Select the level that best describes your current educational status
          </Text>
          
          <div className="form-section">
            <Radio.Group
              value={studyingLevel}
              onChange={(e) => setStudyingLevel(e.target.value)}
              className="radio-group"
            >
              {studyingOptions.map(option => (
                <Radio key={option.value} value={option.value} className="radio-option">
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
      )
    },
    {
      title: 'Personal Details',
      content: (
        <div className="step-content">
          <Title level={3}>Provide your personal details</Title>
          <Text type="secondary">
            Fill in the required information to complete your application
          </Text>
          
          <div className="form-section">
            <Row gutter={16}>
              <Col span={12}>
                <Title level={4}>Caste Categories</Title>
                <Text type="secondary">Select all that apply</Text>
                <Checkbox.Group
                  options={casteOptions}
                  value={caste}
                  onChange={setCaste}
                  className="checkbox-group"
                />
              </Col>
              
              <Col span={12}>
                <Title level={4}>Financial Information</Title>
                <Text type="secondary">Annual income in thousands</Text>
                <InputNumber
                  size="large"
                  placeholder="Enter annual income"
                  value={annualIncome}
                  onChange={setAnnualIncome}
                  min={0}
                  step={1}
                  addonAfter="K"
                  style={{ width: '100%', marginBottom: 20 }}
                />
                
                <Title level={4}>Academic Performance</Title>
                <Text type="secondary">CGPA (0-10 scale)</Text>
                <InputNumber
                  size="large"
                  placeholder="Enter CGPA"
                  value={cgpa}
                  onChange={setCgpa}
                  min={0}
                  max={10}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%', marginBottom: 20 }}
                />
                
                <Text type="secondary">SSC Score (0-600)</Text>
                <InputNumber
                  size="large"
                  placeholder="Enter SSC score"
                  value={sscScore}
                  onChange={setSscScore}
                  min={0}
                  max={600}
                  step={1}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>
        </div>
      )
    },
    {
      title: 'Result',
      content: (
        <div className="step-content">
          {eligibilityResult ? (
            <Result
              status="success"
              icon={<CheckCircleOutlined />}
              title="Congratulations! You are eligible!"
              subTitle={`You have been awarded ${scholarship.amount} APT scholarship.`}
              extra={[
                <Button 
                  type="primary" 
                  key="applications"
                  onClick={handleViewApplications}
                  size="large"
                >
                  View My Applications
                </Button>,
                <Button 
                  key="back"
                  onClick={handleBackToScholarships}
                  size="large"
                >
                  Back to Scholarships
                </Button>
              ]}
            />
          ) : (
            <Result
              status="error"
              icon={<CloseCircleOutlined />}
              title="Sorry, you are not eligible"
              subTitle="Your profile does not meet the scholarship requirements."
              extra={[
                <Button 
                  type="primary" 
                  key="back"
                  onClick={handleBackToScholarships}
                  size="large"
                >
                  Back to Scholarships
                </Button>
              ]}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div className="scholarship-application">
      <div className="application-container">
        <div className="header-section">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToScholarships}
            className="back-button"
          >
            Back to Scholarships
          </Button>
          
          <div className="scholarship-summary">
            <Card size="small" className="summary-card">
              <Row gutter={16}>
                <Col span={8}>
                  <div className="summary-item">
                    <DollarOutlined className="summary-icon" />
                    <div>
                      <Text strong>Amount</Text>
                      <div className="summary-value">{scholarship.amount} APT</div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="summary-item">
                    <UserOutlined className="summary-icon" />
                    <div>
                      <Text strong>Provider</Text>
                      <div className="summary-value">{scholarship.providerAddress.slice(0, 10)}...</div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="summary-item">
                    <CheckCircleOutlined className="summary-icon" />
                    <div>
                      <Text strong>Status</Text>
                      <div className="summary-value">Active</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>

        <Card className="application-card">
          <Steps current={currentStep} className="application-steps">
            {steps.map(step => (
              <Step key={step.title} title={step.title} />
            ))}
          </Steps>

          <Divider />

          <div className="steps-content">
            {steps[currentStep].content}
          </div>

          <Divider />

          <div className="steps-action">
            {currentStep > 0 && currentStep < 2 && (
              <Button onClick={handleBack} className="back-button-step">
                Back
              </Button>
            )}
            {currentStep < 2 && (
              <Button 
                type="primary" 
                onClick={handleNext}
                loading={isProcessing}
                className="next-button"
              >
                {currentStep === 1 ? 'Submit Application' : 'Next'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipApplication;

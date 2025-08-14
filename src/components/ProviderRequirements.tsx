import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import { 
  Card, 
  Checkbox, 
  InputNumber, 
  Button, 
  Typography, 
  Space, 
  message, 
  Divider,
  Row,
  Col
} from 'antd';
import { SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ProviderRequirements.css';

const { Title, Text } = Typography;

interface LocationState {
  amount: number;
  providerAddress: string;
}

const ProviderRequirements: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { platformKey } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [studyingLevel, setStudyingLevel] = useState<string[]>([]);
  const [caste, setCaste] = useState<string[]>([]);
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [sscScore, setSscScore] = useState<number | null>(null);

  // Get data from previous page
  const state = location.state as LocationState;
  const { amount, providerAddress } = state || {};

  useEffect(() => {
    if (!state) {
      message.error('Please complete the previous step first');
      navigate('/provider/login');
    }
  }, [state, navigate]);

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

  const validateForm = (): boolean => {
    if (studyingLevel.length === 0) {
      message.error('Please select at least one studying level');
      return false;
    }
    if (caste.length === 0) {
      message.error('Please select at least one caste');
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Store data in Pinata IPFS
      const scholarshipData = {
        providerAddress,
        amount,
        studyingLevel,
        caste,
        annualIncome,
        cgpa,
        sscScore,
        platformWallet: platformKey,
        timestamp: new Date().toISOString(),
        type: 'scholarship_requirements'
      };

      // For demo purposes, we'll simulate storing to Pinata
      // In production, you would use the actual Pinata API
      console.log('Storing scholarship data to Pinata:', scholarshipData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store in local storage for demo (replace with actual Pinata integration)
      const existingScholarships = JSON.parse(localStorage.getItem('scholarships') || '[]');
      const newScholarship = {
        id: Date.now(),
        ...scholarshipData
      };
      existingScholarships.push(newScholarship);
      localStorage.setItem('scholarships', JSON.stringify(existingScholarships));

      message.success('Scholarship requirements saved successfully!');
      
      // Navigate back to landing page
      navigate('/');
    } catch (error) {
      message.error('Failed to save requirements');
      console.error('Error saving requirements:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state) {
    return null;
  }

  return (
    <div className="provider-requirements">
      <div className="requirements-container">
        <Card className="requirements-card">
          <Space direction="vertical" size="large" className="requirements-content">
            <div className="header-section">
              <Title level={2}>Set Scholarship Requirements</Title>
              <Text type="secondary">
                Define the eligibility criteria for your scholarship
              </Text>
            </div>

            <div className="summary-section">
              <Card size="small" className="summary-card">
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Amount:</Text> {amount} APT
                  </Col>
                  <Col span={12}>
                    <Text strong>Provider:</Text> {providerAddress?.slice(0, 10)}...
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 10 }}>
                  <Col span={12}>
                    <Text strong>Platform Wallet:</Text> {platformKey?.slice(0, 10)}...
                  </Col>
                </Row>
              </Card>
            </div>

            <Divider />

            <div className="form-section">
              <Title level={4}>Studying Level</Title>
              <Text type="secondary">Select the education levels eligible for this scholarship</Text>
                          <Checkbox.Group
              options={studyingOptions}
              value={studyingLevel}
              onChange={setStudyingLevel}
              className="checkbox-group"
            />

              <Title level={4}>Caste Categories</Title>
              <Text type="secondary">Select the caste categories eligible for this scholarship</Text>
                          <Checkbox.Group
              options={casteOptions}
              value={caste}
              onChange={setCaste}
              className="checkbox-group"
            />

              <Title level={4}>Annual Income</Title>
              <Text type="secondary">Maximum annual income allowed (in thousands)</Text>
              <InputNumber
                size="large"
                placeholder="Enter annual income"
                value={annualIncome}
                onChange={setAnnualIncome}
                min={0}
                step={1}
                addonAfter="K"
                style={{ width: 200 }}
              />

              <Title level={4}>CGPA Requirement</Title>
              <Text type="secondary">Minimum CGPA required (0-10 scale)</Text>
              <InputNumber
                size="large"
                placeholder="Enter CGPA"
                value={cgpa}
                onChange={setCgpa}
                min={0}
                max={10}
                step={0.01}
                precision={2}
                style={{ width: 200 }}
              />

              <Title level={4}>SSC Score Requirement</Title>
              <Text type="secondary">Maximum SSC score allowed (0-600)</Text>
              <InputNumber
                size="large"
                placeholder="Enter SSC score"
                value={sscScore}
                onChange={setSscScore}
                min={0}
                max={600}
                step={1}
                style={{ width: 200 }}
              />
            </div>

            <div className="submit-section">
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Saving...' : 'Save Requirements'}
              </Button>
            </div>

            <div className="info-section">
              <Text type="secondary">
                <CheckCircleOutlined /> Your scholarship will be automatically listed for eligible applicants
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default ProviderRequirements;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Button, Row, Col, Tag, Empty, Spin } from 'antd';
import { 
  BookOutlined, 
  DollarOutlined, 
  UserOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './ActiveScholarships.css';

const { Title, Text, Paragraph } = Typography;

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

const ActiveScholarships: React.FC = () => {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = () => {
    try {
      const storedScholarships = JSON.parse(localStorage.getItem('scholarships') || '[]');
      setScholarships(storedScholarships);
    } catch (error) {
      console.error('Error loading scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScholarshipClick = (scholarship: Scholarship) => {
    navigate(`/scholarship/apply/${scholarship.id}`, { state: { scholarship } });
  };

  const handleBackToDashboard = () => {
    navigate('/applicant/dashboard');
  };

  const formatStudyingLevel = (levels: string[]) => {
    return levels.map(level => {
      const labels: { [key: string]: string } = {
        'matriculation': 'Matriculation',
        'intermediate': 'Intermediate',
        'undergraduation': 'Under Graduation',
        'postgraduation': 'Post Graduation'
      };
      return labels[level] || level;
    }).join(', ');
  };

  const formatCaste = (castes: string[]) => {
    return castes.map(caste => {
      const labels: { [key: string]: string } = {
        'oc': 'OC',
        'bc': 'BC',
        'sc': 'SC',
        'ct': 'CT'
      };
      return labels[caste] || caste;
    }).join(', ');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="active-scholarships">
        <div className="scholarships-container">
          <div className="loading-container">
            <Spin size="large" />
            <Text>Loading scholarships...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="active-scholarships">
      <div className="scholarships-container">
        <div className="header-section">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            Back to Dashboard
          </Button>
          <Title level={2}>Active Scholarships</Title>
          <Text type="secondary">
            Browse available scholarships and apply for those that match your profile
          </Text>
        </div>

        {scholarships.length === 0 ? (
          <div className="empty-state">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No scholarships available at the moment"
            >
              <Text type="secondary">
                Check back later for new scholarship opportunities
              </Text>
            </Empty>
          </div>
        ) : (
          <div className="scholarships-grid">
            {scholarships.map((scholarship) => (
              <Card 
                key={scholarship.id}
                className="scholarship-card"
                hoverable
                onClick={() => handleScholarshipClick(scholarship)}
              >
                <div className="scholarship-header">
                  <div className="amount-section">
                    <DollarOutlined className="amount-icon" />
                    <Title level={3} className="amount-text">
                      {scholarship.amount} APT
                    </Title>
                  </div>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Active
                  </Tag>
                </div>

                <div className="scholarship-details">
                  <div className="detail-row">
                    <Text strong>Education Level:</Text>
                    <Text>{formatStudyingLevel(scholarship.studyingLevel)}</Text>
                  </div>
                  
                  <div className="detail-row">
                    <Text strong>Caste Categories:</Text>
                    <Text>{formatCaste(scholarship.caste)}</Text>
                  </div>
                  
                  <div className="detail-row">
                    <Text strong>Max Annual Income:</Text>
                    <Text>{scholarship.annualIncome}K</Text>
                  </div>
                  
                  <div className="detail-row">
                    <Text strong>Min CGPA:</Text>
                    <Text>{scholarship.cgpa}/10</Text>
                  </div>
                  
                  <div className="detail-row">
                    <Text strong>Max SSC Score:</Text>
                    <Text>{scholarship.sscScore}/600</Text>
                  </div>
                  
                  <div className="detail-row">
                    <Text strong>Provider:</Text>
                    <Text code className="address-text">
                      {scholarship.providerAddress.slice(0, 10)}...
                    </Text>
                  </div>
                  
                  <div className="detail-row">
                    <Text strong>Posted:</Text>
                    <Text>{formatDate(scholarship.timestamp)}</Text>
                  </div>
                </div>

                <div className="scholarship-actions">
                  <Button 
                    type="primary" 
                    size="large"
                    className="apply-button"
                    icon={<CheckCircleOutlined />}
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveScholarships;


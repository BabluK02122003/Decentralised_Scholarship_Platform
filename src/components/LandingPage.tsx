import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Space } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import './LandingPage.css';

const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleProviderClick = () => {
    navigate('/provider/login');
  };

  const handleApplicantClick = () => {
    navigate('/applicant/login');
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <Title level={1} className="main-title">
          Scholarship Platform
        </Title>
        <Paragraph className="subtitle">
          Connecting students with educational opportunities through blockchain technology
        </Paragraph>
        
        <div className="options-container">
          <Card 
            className="option-card provider-card"
            hoverable
            onClick={handleProviderClick}
          >
            <Space direction="vertical" size="large" align="center">
              <UserOutlined className="option-icon" />
              <Title level={3}>Scholarship Provider</Title>
              <Paragraph>
                Create and fund scholarships for deserving students. 
                Set eligibility criteria and contribute to education.
              </Paragraph>
              <Button type="primary" size="large">
                Become a Provider
              </Button>
            </Space>
          </Card>

          <Card 
            className="option-card applicant-card"
            hoverable
            onClick={handleApplicantClick}
          >
            <Space direction="vertical" size="large" align="center">
              <BookOutlined className="option-icon" />
              <Title level={3}>Scholarship Applicant</Title>
              <Paragraph>
                Discover and apply for scholarships that match your profile. 
                Get financial support for your education.
              </Paragraph>
              <Button type="primary" size="large">
                Apply for Scholarships
              </Button>
            </Space>
          </Card>
        </div>

        <div className="features-section">
          <Title level={2} className="features-title">
            Why Choose Our Platform?
          </Title>
          <div className="features-grid">
            <div className="feature-item">
              <h3>🔒 Secure & Transparent</h3>
              <p>Built on Aptos blockchain for maximum security and transparency</p>
            </div>
            <div className="feature-item">
              <h3>⚡ Instant Processing</h3>
              <p>Smart contracts automatically verify eligibility and process payments</p>
            </div>
            <div className="feature-item">
              <h3>🌐 Global Access</h3>
              <p>Access scholarships from anywhere in the world</p>
            </div>
            <div className="feature-item">
              <h3>💰 No Middlemen</h3>
              <p>Direct peer-to-peer scholarship distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import { Button, Card, Typography, Space, Statistic, Row, Col } from 'antd';
import { 
  BookOutlined, 
  FileTextOutlined, 
  LogoutOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import './ApplicantDashboard.css';

const { Title, Text } = Typography;

const ApplicantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { account, balance, disconnect } = useWalletContext();
  const [availableScholarships, setAvailableScholarships] = useState(0);
  const [applications, setApplications] = useState(0);

  useEffect(() => {
    // Initialize demo data if none exists
    if (!localStorage.getItem('scholarships')) {
      const demoScholarships = [
        {
          id: 1,
          providerAddress: '0xc2caa68f26fd69ece51468121283739a8937d6e2e1db3181c76212bda07fbf7d',
          amount: 5.0,
          studyingLevel: ['undergraduation', 'postgraduation'],
          caste: ['oc', 'bc', 'sc'],
          annualIncome: 500,
          cgpa: 7.5,
          sscScore: 450,
          platformWallet: '0x74b5179e5a25a09620e85ffe50d1e06040e916e343fc7c2363321b379ce5ca19',
          timestamp: new Date().toISOString(),
          type: 'scholarship_requirements'
        },
        {
          id: 2,
          providerAddress: '0xc2caa68f26fd69ece51468121283739a8937d6e2e1db3181c76212bda07fbf7d',
          amount: 3.5,
          studyingLevel: ['intermediate', 'undergraduation'],
          caste: ['bc', 'sc', 'ct'],
          annualIncome: 300,
          cgpa: 6.0,
          sscScore: 400,
          platformWallet: '0x74b5179e5a25a09620e85ffe50d1e06040e916e343fc7c2363321b379ce5ca19',
          timestamp: new Date().toISOString(),
          type: 'scholarship_requirements'
        }
      ];
      localStorage.setItem('scholarships', JSON.stringify(demoScholarships));
    }

    // Load statistics
    const scholarships = JSON.parse(localStorage.getItem('scholarships') || '[]');
    const userApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    setAvailableScholarships(scholarships.length);
    setApplications(userApplications.length);
  }, []);

  const handleLogout = () => {
    disconnect();
    navigate('/');
  };

  return (
    <div className="applicant-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Title level={2}>Welcome to Your Dashboard</Title>
          <Text type="secondary">
            Manage your scholarship applications and discover new opportunities
          </Text>
        </div>

        <div className="wallet-info-section">
          <Card className="wallet-card">
            <Row gutter={16} align="middle">
              <Col span={12}>
                <div className="wallet-details">
                  <Text strong>Connected Wallet:</Text>
                  <Text code className="wallet-address">
                    {account || 'Demo Applicant Wallet'}
                  </Text>
                  <Text type="secondary">
                    Balance: {balance} APT
                  </Text>
                </div>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </Button>
              </Col>
            </Row>
          </Card>
        </div>

        <div className="stats-section">
          <Row gutter={16}>
            <Col span={8}>
              <Card className="stat-card">
                <Statistic
                  title="Available Scholarships"
                  value={availableScholarships}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="stat-card">
                <Statistic
                  title="Your Applications"
                  value={applications}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="stat-card">
                <Statistic
                  title="Total Awarded"
                  value={applications * 2.5}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                  suffix="APT"
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div className="actions-section">
          <Row gutter={16}>
            <Col span={12}>
              <Card 
                className="action-card"
                hoverable
                onClick={() => navigate('/scholarships/active')}
              >
                <Space direction="vertical" size="large" align="center">
                  <BookOutlined className="action-icon" />
                  <Title level={3}>Active Scholarships</Title>
                  <Text type="secondary">
                    Browse and apply for available scholarships
                  </Text>
                  <Button type="primary" size="large">
                    View Scholarships
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card 
                className="action-card"
                hoverable
                onClick={() => navigate('/scholarships/applied')}
              >
                <Space direction="vertical" size="large" align="center">
                  <FileTextOutlined className="action-icon" />
                  <Title level={3}>Applied Scholarships</Title>
                  <Text type="secondary">
                    Track your application status and results
                  </Text>
                  <Button type="primary" size="large">
                    View Applications
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;

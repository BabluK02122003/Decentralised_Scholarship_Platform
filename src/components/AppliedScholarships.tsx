import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import { Card, Typography, Space, Button, Tag, Empty, Spin, Row, Col, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  DollarOutlined
} from '@ant-design/icons';
import './AppliedScholarships.css';

const { Title, Text } = Typography;

interface Application {
  id: number;
  scholarshipId: number;
  applicantAddress: string;
  studyingLevel: string;
  caste: string[];
  annualIncome: number;
  cgpa: number;
  sscScore: number;
  status: string;
  timestamp: string;
  amount: number;
}

const AppliedScholarships: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWalletContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    try {
      const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      // Filter applications for current user
      const userApplications = storedApplications.filter((app: Application) => 
        app.applicantAddress === account
      );
      setApplications(userApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/applicant/dashboard');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircleOutlined />;
      case 'rejected':
        return <CloseCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const formatStudyingLevel = (level: string) => {
    const labels: { [key: string]: string } = {
      'matriculation': 'Matriculation',
      'intermediate': 'Intermediate',
      'undergraduation': 'Under Graduation',
      'postgraduation': 'Post Graduation'
    };
    return labels[level] || level;
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

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;
  };

  const getTotalAmount = () => {
    return applications
      .filter(app => app.status.toLowerCase() === 'approved')
      .reduce((sum, app) => sum + app.amount, 0);
  };

  if (loading) {
    return (
      <div className="applied-scholarships">
        <div className="scholarships-container">
          <div className="loading-container">
            <Spin size="large" />
            <Text>Loading your applications...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="applied-scholarships">
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
          <Title level={2}>Applied Scholarships</Title>
          <Text type="secondary">
            Track the status of your scholarship applications
          </Text>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No applications found"
            >
              <Text type="secondary">
                You haven't applied for any scholarships yet
              </Text>
              <div style={{ marginTop: 20 }}>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate('/scholarships/active')}
                >
                  Browse Scholarships
                </Button>
              </div>
            </Empty>
          </div>
        ) : (
          <>
            <div className="stats-section">
              <Row gutter={16}>
                <Col span={6}>
                  <Card className="stat-card">
                    <Statistic
                      title="Total Applications"
                      value={applications.length}
                      prefix={<FileTextOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="stat-card">
                    <Statistic
                      title="Approved"
                      value={getStatusCount('approved')}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="stat-card">
                    <Statistic
                      title="Pending"
                      value={getStatusCount('pending')}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="stat-card">
                    <Statistic
                      title="Total Awarded"
                      value={getTotalAmount()}
                      suffix="APT"
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="applications-grid">
              {applications.map((application) => (
                <Card 
                  key={application.id}
                  className="application-card"
                  hoverable
                >
                  <div className="application-header">
                    <div className="amount-section">
                      <DollarOutlined className="amount-icon" />
                      <Title level={3} className="amount-text">
                        {application.amount} APT
                      </Title>
                    </div>
                    <Tag 
                      color={getStatusColor(application.status)} 
                      icon={getStatusIcon(application.status)}
                      className="status-tag"
                    >
                      {application.status}
                    </Tag>
                  </div>

                  <div className="application-details">
                    <div className="detail-row">
                      <Text strong>Education Level:</Text>
                      <Text>{formatStudyingLevel(application.studyingLevel)}</Text>
                    </div>
                    
                    <div className="detail-row">
                      <Text strong>Caste Categories:</Text>
                      <Text>{formatCaste(application.caste)}</Text>
                    </div>
                    
                    <div className="detail-row">
                      <Text strong>Annual Income:</Text>
                      <Text>{application.annualIncome}K</Text>
                    </div>
                    
                    <div className="detail-row">
                      <Text strong>CGPA:</Text>
                      <Text>{application.cgpa}/10</Text>
                    </div>
                    
                    <div className="detail-row">
                      <Text strong>SSC Score:</Text>
                      <Text>{application.sscScore}/600</Text>
                    </div>
                    
                    <div className="detail-row">
                      <Text strong>Applied On:</Text>
                      <Text>{formatDate(application.timestamp)}</Text>
                    </div>
                  </div>

                  {application.status.toLowerCase() === 'approved' && (
                    <div className="approval-message">
                      <Text type="success">
                        <CheckCircleOutlined /> Congratulations! Your scholarship has been approved.
                      </Text>
                    </div>
                  )}

                  {application.status.toLowerCase() === 'rejected' && (
                    <div className="rejection-message">
                      <Text type="danger">
                        <CloseCircleOutlined /> Unfortunately, your application was not approved.
                      </Text>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppliedScholarships;


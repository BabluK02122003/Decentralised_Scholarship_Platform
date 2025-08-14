import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Button, Card, Typography, Space, message } from 'antd';
import { WalletOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import './ApplicantLogin.css';

const { Title, Text } = Typography;

const ApplicantLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, account, applicantKey } = useWalletContext();
  const { connected, account: walletAccount, disconnect: walletDisconnect } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    // Check if wallet is connected from the wallet adapter
    if (connected && walletAccount) {
      setIsWalletConnected(true);
      message.success('Wallet connected successfully!');
    } else {
      setIsWalletConnected(false);
    }
  }, [connected, walletAccount]);

  const handleConnectWallet = async () => {
    try {
      // The wallet connection is now handled by the WalletSelector component
      // Users can select their Petra wallet from the top-right corner
      message.info('Please use the wallet selector in the top-right corner to connect your Petra wallet');
    } catch (error) {
      message.error('Failed to connect wallet');
      console.error('Wallet connection error:', error);
    }
  };

  const handleDisconnectWallet = () => {
    walletDisconnect();
    setIsWalletConnected(false);
    message.info('Wallet disconnected');
    navigate('/');
  };

  const handleContinue = () => {
    if (isWalletConnected) {
      navigate('/applicant/dashboard');
    } else {
      message.error('Please connect your wallet first');
    }
  };

  const isApplicantWallet = account === applicantKey;

  return (
    <div className="applicant-login">
      <div className="login-container">
        <Card className="login-card">
          <Space direction="vertical" size="large" align="center" className="login-content">
            <div className="header-section">
              <UserOutlined className="header-icon" />
              <Title level={2}>Applicant Login</Title>
              <Text type="secondary">
                Connect your Petra wallet to browse and apply for scholarships
              </Text>
            </div>
            
            <div className="wallet-section">
              <Title level={4}>Connect Your Wallet</Title>
              <Text type="secondary">
                Connect your Petra wallet to access the scholarship platform
              </Text>
              
              {!isWalletConnected ? (
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<WalletOutlined />}
                  onClick={handleConnectWallet}
                  className="connect-button"
                >
                  Connect Wallet
                </Button>
              ) : (
                <div className="wallet-status">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<CheckCircleOutlined />}
                    className="connected-button"
                    disabled
                  >
                    Wallet Connected
                  </Button>
                  <Button 
                    onClick={handleDisconnectWallet}
                    className="disconnect-button"
                  >
                    Disconnect
                  </Button>
                </div>
              )}
            </div>

            {isWalletConnected && (
              <div className="wallet-info">
                <Text strong>Connected Address:</Text>
                <Text code className="address-text">
                  {account || walletAccount?.address?.toString() || 'Demo Applicant Address'}
                </Text>
                <Text type="secondary">
                  Expected Applicant Key: {applicantKey}
                </Text>
                {isApplicantWallet ? (
                  <Text type="success">✓ Correct applicant wallet</Text>
                ) : (
                  <Text type="warning">⚠ Demo mode - using demo address</Text>
                )}
              </div>
            )}

            {isWalletConnected && (
              <div className="continue-section">
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleContinue}
                  className="continue-button"
                  icon={<UserOutlined />}
                >
                  Continue to Dashboard
                </Button>
                
                <div className="info-text">
                  <Text type="secondary">
                    Access available scholarships and manage your applications
                  </Text>
                </div>
              </div>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantLogin;

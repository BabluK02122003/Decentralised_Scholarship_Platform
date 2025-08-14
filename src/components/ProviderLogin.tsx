import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Button, Card, Typography, Space, message, InputNumber } from 'antd';
import { WalletOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { blockchainService } from '../services/blockchainService';
import './ProviderLogin.css';

const { Title, Text } = Typography;

const ProviderLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, account, providerKey } = useWalletContext();
  const { connected, account: walletAccount, disconnect: walletDisconnect } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string>('');

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
  };

  const handleAmountSubmit = async () => {
    if (!amount || amount <= 0) {
      message.error('Please enter a valid amount');
      return;
    }

    if (!isWalletConnected) {
      message.error('Please connect your wallet first');
      return;
    }

    if (!walletAccount?.address) {
      message.error('Wallet address not available');
      return;
    }

    setIsProcessing(true);
    setTransactionStatus('Preparing transaction...');
    
    try {
      // Create scholarship data for the Move contract
      const scholarshipData = {
        amount: amount,
        studying_level: [1, 2, 3], // Undergraduate, Graduate, PhD
        caste: [1, 2, 3, 4], // All castes eligible
        annual_income: 500000, // 5 lakhs annual income limit
        cgpa: 7.5, // 7.5 CGPA requirement
        ssc_score: 500 // SSC score requirement
      };

      setTransactionStatus('Creating scholarship on blockchain...');
      
      // Call the blockchain service to create scholarship
      const transactionHash = await blockchainService.createScholarship(
        walletAccount,
        scholarshipData
      );
      
      setTransactionStatus(`Transaction successful! Hash: ${transactionHash.substring(0, 8)}...`);
      message.success(`Successfully created scholarship! Transaction: ${transactionHash.substring(0, 8)}...`);
      
      // Navigate to requirements page
      navigate('/provider/requirements', { 
        state: { 
          amount,
          providerAddress: walletAccount.address.toString(),
          transactionHash
        } 
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
      message.error(`Failed to create scholarship: ${errorMessage}`);
      console.error('Transaction error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isProviderWallet = account === providerKey;

  return (
    <div className="provider-login">
      <div className="login-container">
        <Card className="login-card">
          <Space direction="vertical" size="large" align="center" className="login-content">
            <Title level={2}>Provider Login</Title>
            
            <div className="wallet-section">
              <Title level={4}>Connect Your Wallet</Title>
              <Text type="secondary">
                Connect your Petra wallet to create scholarships
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
                <div className="info-row">
                  <Text strong>Connected Address:</Text>
                  <Text code className="address-text">
                    {account || walletAccount?.address?.toString() || 'Demo Provider Address'}
                  </Text>
                </div>
                <div className="info-row">
                  <Text type="secondary">Expected Provider Key:</Text>
                  <Text code className="key-text">{providerKey}</Text>
                </div>
                <div className="info-row">
                  {isProviderWallet ? (
                    <Text type="success">✓ Correct provider wallet</Text>
                  ) : (
                    <Text type="warning">⚠ Demo mode - using demo address</Text>
                  )}
                </div>
              </div>
            )}

            {isWalletConnected && (
              <div className="amount-section">
                <Title level={4}>Enter Scholarship Amount</Title>
                <Text type="secondary">
                  Enter the amount you want to contribute to the scholarship fund
                </Text>
                
                <div className="demo-notice">
                  <Text type="warning">
                    ⚠️ Demo Mode: Currently simulating blockchain transactions. 
                    To enable real APT transfers, deploy the Move contract following DEPLOYMENT.md
                  </Text>
                </div>
                
                <div className="amount-input">
                  <InputNumber
                    size="large"
                    placeholder="Enter amount in APT"
                    value={amount}
                    onChange={(value) => setAmount(value)}
                    min={0.1}
                    step={0.1}
                    precision={2}
                    addonAfter="APT"
                    style={{ width: '200px' }}
                  />
                </div>
                
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleAmountSubmit}
                  loading={isProcessing}
                  disabled={!amount || amount <= 0}
                  icon={<DollarOutlined />}
                  className="submit-button"
                >
                  {isProcessing ? 'Processing...' : 'Submit Amount'}
                </Button>

                {transactionStatus && (
                  <div className="transaction-status">
                    <Text type="secondary">{transactionStatus}</Text>
                  </div>
                )}
              </div>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default ProviderLogin;

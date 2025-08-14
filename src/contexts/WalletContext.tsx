import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { blockchainService } from '../services/blockchainService';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  providerKey: string;
  applicantKey: string;
  platformKey: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { connected, account, disconnect: walletDisconnect } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  // Wallet keys as specified in requirements
  const providerKey = "0xc2caa68f26fd69ece51468121283739a8937d6e2e1db3181c76212bda07fbf7d";
  const applicantKey = "0xf4057e68dfbce2d354d338f26aa2fd4aa648b4efbbe44fc5b11a2b5fcfe39767";
  const platformKey = "0x74b5179e5a25a09620e85ffe50d1e06040e916e343fc7c2363321b379ce5ca19";

  const connect = async () => {
    // Wallet connection is handled by the wallet adapter
    // This function can be used for additional setup if needed
  };

  const disconnect = () => {
    walletDisconnect();
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && account) {
        try {
          const realBalance = await blockchainService.getAccountBalance(account?.address?.toString() || '');
          setBalance(realBalance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(0);
        }
      } else {
        setBalance(0);
      }
    };

    fetchBalance();
  }, [connected, account]);

  const value: WalletContextType = {
    isConnected: connected,
    account: account?.address?.toString() || null,
    balance,
    connect,
    disconnect,
    providerKey,
    applicantKey,
    platformKey,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Aptos network configuration
export const APTOS_CONFIG = {
  NETWORK: process.env.REACT_APP_APTOS_NETWORK || 'testnet',
  NODE_URL: process.env.REACT_APP_APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com',
  MODULE_ADDRESS: '0x74b5179e5a25a09620e85ffe50d1e06040e916e343fc7c2363321b379ce5ca19',
  MODULE_NAME: 'scholarship_platform'
};

// Network-specific configurations
export const NETWORK_CONFIGS = {
  testnet: {
    name: 'Testnet',
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com',
    faucetUrl: 'https://faucet.testnet.aptoslabs.com',
    explorerUrl: 'https://explorer.aptoslabs.com/account'
  },
  mainnet: {
    name: 'Mainnet',
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com',
    explorerUrl: 'https://explorer.aptoslabs.com/account'
  }
};

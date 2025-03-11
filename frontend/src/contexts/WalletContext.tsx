import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  connected: boolean;
  address: string;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendTransaction: (to: string, amount: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: '',
  balance: '0',
  connect: async () => {},
  disconnect: () => {},
  sendTransaction: async () => '',
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            
            setProvider(provider);
            setSigner(signer);
            setAddress(address);
            setBalance(ethers.formatEther(balance));
            setConnected(true);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setBalance(ethers.formatEther(balance));
        setConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet');
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
    setBalance('0');
    setProvider(null);
    setSigner(null);
  };

  const sendTransaction = async (to: string, amount: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      return tx.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        balance,
        connect,
        disconnect,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Add this to make TypeScript happy with window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
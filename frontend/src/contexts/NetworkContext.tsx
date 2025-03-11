import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface NetworkContextType {
  networkName: string;
  chainId: string;
  blockHeight: number;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const NetworkContext = createContext<NetworkContextType>({
  networkName: 'HyperNova',
  chainId: '0x1',
  blockHeight: 0,
  isConnected: false,
  isLoading: true,
  error: null,
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [networkName, setNetworkName] = useState('HyperNova');
  const [chainId, setChainId] = useState('0x1');
  const [blockHeight, setBlockHeight] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        // In a real implementation, this would fetch from the actual node
        // For now, we'll simulate network data
        const response = await axios.get('/api/network');
        
        // Simulate network data
        setNetworkName('HyperNova Testnet');
        setChainId('0x539');
        setBlockHeight(Math.floor(Math.random() * 1000000));
        setIsConnected(true);
        setError(null);
      } catch (error) {
        console.error('Error fetching network info:', error);
        setError('Failed to connect to network');
        
        // Simulate network data even on error
        setNetworkName('HyperNova Testnet');
        setChainId('0x539');
        setBlockHeight(Math.floor(Math.random() * 1000000));
        setIsConnected(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkInfo();

    // Simulate block updates
    const interval = setInterval(() => {
      setBlockHeight(prevHeight => prevHeight + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        networkName,
        chainId,
        blockHeight,
        isConnected,
        isLoading,
        error,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
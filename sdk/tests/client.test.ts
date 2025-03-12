import { HyperNovaClient } from '../src/client';
import { Transaction } from '../src/transaction';
import { Wallet } from '../src/wallet';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HyperNovaClient', () => {
  let client: HyperNovaClient;
  
  beforeEach(() => {
    // Create a client for testing
    client = new HyperNovaClient({
      nodeUrl: 'http://localhost:8545',
      aiApiUrl: 'http://localhost:8000',
      privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    });
    
    // Reset axios mocks
    mockedAxios.post.mockReset();
    mockedAxios.create.mockReturnValue({
      post: mockedAxios.post,
      get: mockedAxios.get,
    } as any);
  });
  
  describe('getNetworkInfo', () => {
    it('should return network information', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: {
            name: 'HyperNova Testnet',
            networkId: '539',
            chainId: '0x539',
            protocolVersion: '1.0.0',
            blockHeight: 1000000,
            consensusMechanism: 'Proof of AI + DPoS',
            peerCount: 42,
            isSyncing: false,
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await client.getNetworkInfo();
      
      // Check that the result is correct
      expect(result).toEqual(mockResponse.data.result);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_getNetworkInfo',
        params: [],
        id: 1,
      });
    });
  });
  
  describe('getLatestBlock', () => {
    it('should return the latest block', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: {
            header: {
              version: 1,
              prevHash: '0x1234...',
              merkleRoot: '0x5678...',
              timestamp: 1625097600,
              height: 1000000,
              difficulty: 12345,
              nonce: 67890,
              shardId: 0,
            },
            hash: '0xabcd...',
            transactions: ['0x1234...', '0x5678...'],
            validatorSignature: '0x9012...',
            aiProof: {
              nonce: 12345,
              hash: '0xefgh...',
              confidence: 0.95,
              timestamp: 1625097600,
              model_id: 'model1',
            },
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await client.getLatestBlock();
      
      // Check that the result is correct
      expect(result).toEqual(mockResponse.data.result);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_getLatestBlock',
        params: [],
        id: 1,
      });
    });
  });
  
  describe('getBlockByHash', () => {
    it('should return a block by hash', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: {
            header: {
              version: 1,
              prevHash: '0x1234...',
              merkleRoot: '0x5678...',
              timestamp: 1625097600,
              height: 1000000,
              difficulty: 12345,
              nonce: 67890,
              shardId: 0,
            },
            hash: '0xabcd...',
            transactions: ['0x1234...', '0x5678...'],
            validatorSignature: '0x9012...',
            aiProof: {
              nonce: 12345,
              hash: '0xefgh...',
              confidence: 0.95,
              timestamp: 1625097600,
              model_id: 'model1',
            },
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await client.getBlockByHash('0xabcd...');
      
      // Check that the result is correct
      expect(result).toEqual(mockResponse.data.result);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_getBlockByHash',
        params: ['0xabcd...'],
        id: 1,
      });
    });
  });
  
  describe('getBlockByHeight', () => {
    it('should return a block by height', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: {
            header: {
              version: 1,
              prevHash: '0x1234...',
              merkleRoot: '0x5678...',
              timestamp: 1625097600,
              height: 1000000,
              difficulty: 12345,
              nonce: 67890,
              shardId: 0,
            },
            hash: '0xabcd...',
            transactions: ['0x1234...', '0x5678...'],
            validatorSignature: '0x9012...',
            aiProof: {
              nonce: 12345,
              hash: '0xefgh...',
              confidence: 0.95,
              timestamp: 1625097600,
              model_id: 'model1',
            },
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await client.getBlockByHeight(1000000);
      
      // Check that the result is correct
      expect(result).toEqual(mockResponse.data.result);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_getBlockByHeight',
        params: [1000000],
        id: 1,
      });
    });
  });
  
  describe('getAccount', () => {
    it('should return account information', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: {
            address: '0x1234...',
            balance: '1000000000000000000',
            nonce: 42,
            isContract: false,
            code: null,
            storage: null,
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await client.getAccount('0x1234...');
      
      // Check that the result is correct
      expect(result).toEqual(mockResponse.data.result);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_getAccount',
        params: ['0x1234...'],
        id: 1,
      });
    });
  });
  
  describe('getTransaction', () => {
    it('should return a transaction', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: {
            type: 'transfer',
            from: '0x1234...',
            to: '0x5678...',
            amount: '1000000000000000000',
            data: '0x',
            fee: '1000000000',
            nonce: 42,
            timestamp: 1625097600,
            signature: '0x9012...',
            quantumSignature: '0xabcd...',
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await client.getTransaction('0x1234...');
      
      // Check that the result is a Transaction instance
      expect(result).toBeInstanceOf(Transaction);
      
      // Check that the transaction has the correct properties
      expect(result.from).toEqual(mockResponse.data.result.from);
      expect(result.to).toEqual(mockResponse.data.result.to);
      expect(result.amount).toEqual(mockResponse.data.result.amount);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_getTransactionByHash',
        params: ['0x1234...'],
        id: 1,
      });
    });
  });
  
  describe('getTransactionReceipt', () => {
    it('should return a transaction receipt', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: {
            transactionHash: '0x1234...',
            blockHash: '0x5678...',
            blockHeight: 1000000,
            transactionIndex: 0,
            from: '0x1234...',
            to: '0x5678...',
            contractAddress: null,
            gasUsed: '21000',
            status: 1,
            logs: [],
            confirmations: 10,
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await client.getTransactionReceipt('0x1234...');
      
      // Check that the result is correct
      expect(result).toEqual(mockResponse.data.result);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_getTransactionReceipt',
        params: ['0x1234...'],
        id: 1,
      });
    });
  });
  
  describe('sendTransaction', () => {
    it('should send a transaction', async () => {
      // Mock response
      const mockResponse = {
        data: {
          result: '0x1234...',
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      // Create a transaction
      const tx = new Transaction({
        from: '0x1234...',
        to: '0x5678...',
        amount: '1.0',
      });
      
      // Mock the wallet's signTransaction method
      const mockSignedTx = '0xsigned1234...';
      jest.spyOn(Wallet.prototype, 'signTransaction').mockReturnValue(mockSignedTx);
      
      // Call the method
      const result = await client.sendTransaction(tx);
      
      // Check that the result is correct
      expect(result).toEqual(mockResponse.data.result);
      
      // Check that the correct request was made
      expect(mockedAxios.post).toHaveBeenCalledWith('/', {
        jsonrpc: '2.0',
        method: 'hnc_sendRawTransaction',
        params: [mockSignedTx],
        id: 1,
      });
    });
    
    it('should throw an error if wallet is not initialized', async () => {
      // Create a client without a wallet
      const clientWithoutWallet = new HyperNovaClient({
        nodeUrl: 'http://localhost:8545',
        aiApiUrl: 'http://localhost:8000',
      });
      
      // Create a transaction
      const tx = new Transaction({
        from: '0x1234...',
        to: '0x5678...',
        amount: '1.0',
      });
      
      // Call the method and expect it to throw
      await expect(clientWithoutWallet.sendTransaction(tx)).rejects.toThrow(
        'Wallet not initialized. Provide a private key in the client config.'
      );
    });
  });
  
  describe('createTransaction', () => {
    it('should create a transaction', () => {
      // Call the method
      const tx = client.createTransaction('0x5678...', '1.0', '0xdata');
      
      // Check that the transaction has the correct properties
      expect(tx).toBeInstanceOf(Transaction);
      expect(tx.to).toEqual('0x5678...');
      expect(tx.amount).toEqual('1.0');
      expect(tx.data).toEqual('0xdata');
    });
    
    it('should throw an error if wallet is not initialized', () => {
      // Create a client without a wallet
      const clientWithoutWallet = new HyperNovaClient({
        nodeUrl: 'http://localhost:8545',
        aiApiUrl: 'http://localhost:8000',
      });
      
      // Call the method and expect it to throw
      expect(() => clientWithoutWallet.createTransaction('0x5678...', '1.0')).toThrow(
        'Wallet not initialized. Provide a private key in the client config.'
      );
    });
  });
});
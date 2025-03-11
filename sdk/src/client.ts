import axios, { AxiosInstance } from 'axios';
import { Transaction } from './transaction';
import { Wallet } from './wallet';
import { Contract } from './contract';
import { AIClient } from './ai';
import { 
  Block, 
  TransactionReceipt, 
  NetworkInfo, 
  AccountInfo,
  ClientConfig
} from './types';

/**
 * HyperNova Chain client
 */
export class HyperNovaClient {
  private readonly api: AxiosInstance;
  private readonly config: ClientConfig;
  private readonly wallet?: Wallet;
  public readonly ai: AIClient;

  /**
   * Create a new HyperNova Chain client
   * @param config Client configuration
   */
  constructor(config: ClientConfig) {
    this.config = {
      nodeUrl: 'http://localhost:8545',
      aiApiUrl: 'http://localhost:8000',
      ...config
    };

    this.api = axios.create({
      baseURL: this.config.nodeUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (this.config.privateKey) {
      this.wallet = new Wallet(this.config.privateKey);
    }

    this.ai = new AIClient(this.config.aiApiUrl);
  }

  /**
   * Get network information
   * @returns Network information
   */
  async getNetworkInfo(): Promise<NetworkInfo> {
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getNetworkInfo',
      params: [],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Get the latest block
   * @returns Latest block
   */
  async getLatestBlock(): Promise<Block> {
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getLatestBlock',
      params: [],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Get a block by hash
   * @param hash Block hash
   * @returns Block
   */
  async getBlockByHash(hash: string): Promise<Block> {
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getBlockByHash',
      params: [hash],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Get a block by height
   * @param height Block height
   * @returns Block
   */
  async getBlockByHeight(height: number): Promise<Block> {
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getBlockByHeight',
      params: [height],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Get account information
   * @param address Account address
   * @returns Account information
   */
  async getAccount(address: string): Promise<AccountInfo> {
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getAccount',
      params: [address],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Get transaction by hash
   * @param hash Transaction hash
   * @returns Transaction
   */
  async getTransaction(hash: string): Promise<Transaction> {
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getTransactionByHash',
      params: [hash],
      id: 1,
    });

    return new Transaction(response.data.result);
  }

  /**
   * Get transaction receipt
   * @param hash Transaction hash
   * @returns Transaction receipt
   */
  async getTransactionReceipt(hash: string): Promise<TransactionReceipt> {
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getTransactionReceipt',
      params: [hash],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Send a transaction
   * @param tx Transaction to send
   * @returns Transaction hash
   */
  async sendTransaction(tx: Transaction): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Provide a private key in the client config.');
    }

    // Sign the transaction
    const signedTx = this.wallet.signTransaction(tx);

    // Send the transaction
    const response = await this.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_sendRawTransaction',
      params: [signedTx],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Create a new transaction
   * @param to Recipient address
   * @param amount Amount to send
   * @param data Transaction data
   * @returns Transaction
   */
  createTransaction(to: string, amount: string, data: string = ''): Transaction {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Provide a private key in the client config.');
    }

    return new Transaction({
      from: this.wallet.getAddress(),
      to,
      amount,
      data,
      nonce: 0, // Will be set automatically when sending
      fee: '0', // Will be estimated automatically when sending
    });
  }

  /**
   * Get a contract instance
   * @param address Contract address
   * @param abi Contract ABI
   * @returns Contract instance
   */
  getContract(address: string, abi: any[]): Contract {
    return new Contract(this, address, abi);
  }

  /**
   * Deploy a contract
   * @param abi Contract ABI
   * @param bytecode Contract bytecode
   * @param args Constructor arguments
   * @returns Contract address
   */
  async deployContract(abi: any[], bytecode: string, args: any[] = []): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Provide a private key in the client config.');
    }

    // Create contract deployment transaction
    const tx = this.createTransaction('', '0', bytecode);

    // Send the transaction
    const txHash = await this.sendTransaction(tx);

    // Wait for the transaction receipt
    const receipt = await this.waitForTransaction(txHash);

    if (!receipt.contractAddress) {
      throw new Error('Contract deployment failed');
    }

    return receipt.contractAddress;
  }

  /**
   * Wait for a transaction to be confirmed
   * @param txHash Transaction hash
   * @param confirmations Number of confirmations to wait for
   * @returns Transaction receipt
   */
  async waitForTransaction(txHash: string, confirmations: number = 1): Promise<TransactionReceipt> {
    const poll = async (resolve: any, reject: any) => {
      try {
        const receipt = await this.getTransactionReceipt(txHash);
        
        if (receipt && receipt.confirmations >= confirmations) {
          resolve(receipt);
        } else {
          setTimeout(() => poll(resolve, reject), 1000);
        }
      } catch (error) {
        setTimeout(() => poll(resolve, reject), 1000);
      }
    };

    return new Promise(poll);
  }
}
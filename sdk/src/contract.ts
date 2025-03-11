import { ethers } from 'ethers';
import { HyperNovaClient } from './client';
import { Transaction } from './transaction';

/**
 * HyperNova Chain smart contract
 */
export class Contract {
  private readonly client: HyperNovaClient;
  private readonly address: string;
  private readonly abi: any[];
  private readonly interface: ethers.Interface;

  /**
   * Create a new contract instance
   * @param client HyperNova client
   * @param address Contract address
   * @param abi Contract ABI
   */
  constructor(client: HyperNovaClient, address: string, abi: any[]) {
    this.client = client;
    this.address = address;
    this.abi = abi;
    this.interface = new ethers.Interface(abi);
  }

  /**
   * Call a read-only contract method
   * @param method Method name
   * @param args Method arguments
   * @returns Method result
   */
  async call(method: string, ...args: any[]): Promise<any> {
    // Encode the function call
    const data = this.interface.encodeFunctionData(method, args);

    // Create a transaction
    const tx = new Transaction({
      from: '0x0000000000000000000000000000000000000000', // Zero address for calls
      to: this.address,
      amount: '0',
      data,
    });

    // Call the contract
    const response = await this.client.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_call',
      params: [tx.toJSON(), 'latest'],
      id: 1,
    });

    // Decode the result
    return this.interface.decodeFunctionResult(method, response.data.result);
  }

  /**
   * Send a transaction to a contract method
   * @param method Method name
   * @param args Method arguments
   * @param value Amount to send
   * @returns Transaction hash
   */
  async send(method: string, args: any[] = [], value: string = '0'): Promise<string> {
    // Encode the function call
    const data = this.interface.encodeFunctionData(method, args);

    // Create a transaction
    const tx = Transaction.createContractCall(
      this.client.wallet.getAddress(),
      this.address,
      data,
      value
    );

    // Send the transaction
    return this.client.sendTransaction(tx);
  }

  /**
   * Estimate gas for a contract method call
   * @param method Method name
   * @param args Method arguments
   * @param value Amount to send
   * @returns Estimated gas
   */
  async estimateGas(method: string, args: any[] = [], value: string = '0'): Promise<string> {
    // Encode the function call
    const data = this.interface.encodeFunctionData(method, args);

    // Create a transaction
    const tx = Transaction.createContractCall(
      this.client.wallet.getAddress(),
      this.address,
      data,
      value
    );

    // Estimate gas
    const response = await this.client.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_estimateGas',
      params: [tx.toJSON()],
      id: 1,
    });

    return response.data.result;
  }

  /**
   * Get contract events
   * @param eventName Event name
   * @param filter Event filter
   * @param fromBlock From block
   * @param toBlock To block
   * @returns Events
   */
  async getEvents(
    eventName: string,
    filter: any = {},
    fromBlock: number | string = 0,
    toBlock: number | string = 'latest'
  ): Promise<any[]> {
    // Create filter
    const response = await this.client.api.post('/', {
      jsonrpc: '2.0',
      method: 'hnc_getLogs',
      params: [{
        address: this.address,
        topics: [this.interface.getEvent(eventName).topicHash],
        fromBlock,
        toBlock,
      }],
      id: 1,
    });

    // Parse logs
    return response.data.result.map((log: any) => {
      return this.interface.parseLog(log);
    });
  }
}
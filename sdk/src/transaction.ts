import { TransactionData } from './types';

/**
 * HyperNova Chain transaction
 */
export class Transaction {
  /** Transaction type */
  public type?: string;
  /** Sender address */
  public from: string;
  /** Recipient address */
  public to: string;
  /** Amount */
  public amount: string;
  /** Transaction data */
  public data?: string;
  /** Transaction fee */
  public fee?: string;
  /** Nonce */
  public nonce?: number;
  /** Timestamp */
  public timestamp?: number;
  /** Signature */
  public signature?: string;
  /** Quantum-resistant signature */
  public quantumSignature?: string;

  /**
   * Create a new transaction
   * @param data Transaction data
   */
  constructor(data: TransactionData) {
    this.type = data.type;
    this.from = data.from;
    this.to = data.to;
    this.amount = data.amount;
    this.data = data.data;
    this.fee = data.fee;
    this.nonce = data.nonce;
    this.timestamp = data.timestamp || Math.floor(Date.now() / 1000);
    this.signature = data.signature;
    this.quantumSignature = data.quantumSignature;
  }

  /**
   * Convert to JSON
   * @returns Transaction as JSON
   */
  toJSON(): TransactionData {
    return {
      type: this.type,
      from: this.from,
      to: this.to,
      amount: this.amount,
      data: this.data,
      fee: this.fee,
      nonce: this.nonce,
      timestamp: this.timestamp,
      signature: this.signature,
      quantumSignature: this.quantumSignature,
    };
  }

  /**
   * Create a token transfer transaction
   * @param from Sender address
   * @param to Recipient address
   * @param amount Amount to send
   * @returns Transaction
   */
  static createTransfer(from: string, to: string, amount: string): Transaction {
    return new Transaction({
      type: 'transfer',
      from,
      to,
      amount,
    });
  }

  /**
   * Create a contract deployment transaction
   * @param from Deployer address
   * @param bytecode Contract bytecode
   * @param amount Amount to send
   * @returns Transaction
   */
  static createContractDeployment(from: string, bytecode: string, amount: string = '0'): Transaction {
    return new Transaction({
      type: 'contract_deploy',
      from,
      to: '',
      amount,
      data: bytecode,
    });
  }

  /**
   * Create a contract call transaction
   * @param from Caller address
   * @param to Contract address
   * @param data Call data
   * @param amount Amount to send
   * @returns Transaction
   */
  static createContractCall(from: string, to: string, data: string, amount: string = '0'): Transaction {
    return new Transaction({
      type: 'contract_call',
      from,
      to,
      amount,
      data,
    });
  }
}
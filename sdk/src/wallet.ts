import { ethers } from 'ethers';
import { Transaction } from './transaction';

/**
 * HyperNova Chain wallet
 */
export class Wallet {
  private readonly privateKey: string;
  private readonly signer: ethers.Wallet;

  /**
   * Create a new wallet
   * @param privateKey Private key or mnemonic
   */
  constructor(privateKey: string) {
    this.privateKey = privateKey;
    this.signer = new ethers.Wallet(privateKey);
  }

  /**
   * Get the wallet address
   * @returns Wallet address
   */
  getAddress(): string {
    return this.signer.address;
  }

  /**
   * Sign a message
   * @param message Message to sign
   * @returns Signature
   */
  signMessage(message: string): string {
    return this.signer.signMessage(message);
  }

  /**
   * Sign a transaction
   * @param transaction Transaction to sign
   * @returns Signed transaction
   */
  signTransaction(transaction: Transaction): string {
    // Convert to ethers transaction format
    const tx = {
      to: transaction.to,
      value: ethers.parseEther(transaction.amount),
      data: transaction.data || '0x',
      nonce: transaction.nonce || 0,
      gasLimit: ethers.parseUnits(transaction.fee || '0', 'gwei'),
      chainId: 1, // Default chain ID
    };

    // Sign the transaction
    return this.signer.signTransaction(tx);
  }

  /**
   * Create a new random wallet
   * @returns New wallet
   */
  static createRandom(): Wallet {
    const randomWallet = ethers.Wallet.createRandom();
    return new Wallet(randomWallet.privateKey);
  }

  /**
   * Create a wallet from a mnemonic phrase
   * @param mnemonic Mnemonic phrase
   * @returns Wallet
   */
  static fromMnemonic(mnemonic: string): Wallet {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return new Wallet(wallet.privateKey);
  }
}
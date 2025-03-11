import { ethers } from 'ethers';
import { sha256 } from 'ethers/lib/utils';

/**
 * Convert a hex string to bytes
 * @param hex Hex string
 * @returns Bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  return ethers.getBytes(hex);
}

/**
 * Convert bytes to a hex string
 * @param bytes Bytes
 * @returns Hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return ethers.hexlify(bytes);
}

/**
 * Calculate SHA-256 hash of data
 * @param data Data to hash
 * @returns Hash
 */
export function sha256Hash(data: string | Uint8Array): string {
  if (typeof data === 'string') {
    return sha256(ethers.toUtf8Bytes(data));
  } else {
    return sha256(data);
  }
}

/**
 * Format a timestamp as a human-readable date/time
 * @param timestamp Timestamp
 * @returns Formatted date/time
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

/**
 * Format an amount with a given number of decimals
 * @param amount Amount
 * @param decimals Number of decimals
 * @returns Formatted amount
 */
export function formatAmount(amount: string, decimals: number = 18): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Parse an amount with a given number of decimals
 * @param amount Amount
 * @param decimals Number of decimals
 * @returns Parsed amount
 */
export function parseAmount(amount: string, decimals: number = 18): string {
  return ethers.parseUnits(amount, decimals).toString();
}

/**
 * Generate a random nonce
 * @returns Random nonce
 */
export function randomNonce(): number {
  return Math.floor(Math.random() * 1000000000);
}

/**
 * Check if an address is valid
 * @param address Address to check
 * @returns Whether the address is valid
 */
export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch (e) {
    return false;
  }
}
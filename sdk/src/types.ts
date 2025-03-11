/**
 * Client configuration
 */
export interface ClientConfig {
  /** Node URL */
  nodeUrl?: string;
  /** AI API URL */
  aiApiUrl?: string;
  /** Private key for signing transactions */
  privateKey?: string;
}

/**
 * Network information
 */
export interface NetworkInfo {
  /** Network name */
  name: string;
  /** Network ID */
  networkId: string;
  /** Chain ID */
  chainId: string;
  /** Protocol version */
  protocolVersion: string;
  /** Current block height */
  blockHeight: number;
  /** Consensus mechanism */
  consensusMechanism: string;
  /** Number of peers */
  peerCount: number;
  /** Whether the node is syncing */
  isSyncing: boolean;
}

/**
 * Block header
 */
export interface BlockHeader {
  /** Block version */
  version: number;
  /** Previous block hash */
  prevHash: string;
  /** Merkle root of transactions */
  merkleRoot: string;
  /** Block timestamp */
  timestamp: number;
  /** Block height */
  height: number;
  /** Difficulty target */
  difficulty: number;
  /** Nonce */
  nonce: number;
  /** Shard ID */
  shardId: number;
}

/**
 * Block
 */
export interface Block {
  /** Block header */
  header: BlockHeader;
  /** Block hash */
  hash: string;
  /** Transactions in the block */
  transactions: string[];
  /** Validator signature */
  validatorSignature?: string;
  /** AI proof */
  aiProof?: AIProof;
}

/**
 * Transaction
 */
export interface TransactionData {
  /** Transaction type */
  type?: string;
  /** Sender address */
  from: string;
  /** Recipient address */
  to: string;
  /** Amount */
  amount: string;
  /** Transaction data */
  data?: string;
  /** Transaction fee */
  fee?: string;
  /** Nonce */
  nonce?: number;
  /** Timestamp */
  timestamp?: number;
  /** Signature */
  signature?: string;
  /** Quantum-resistant signature */
  quantumSignature?: string;
}

/**
 * Transaction receipt
 */
export interface TransactionReceipt {
  /** Transaction hash */
  transactionHash: string;
  /** Block hash */
  blockHash: string;
  /** Block height */
  blockHeight: number;
  /** Transaction index in the block */
  transactionIndex: number;
  /** Sender address */
  from: string;
  /** Recipient address */
  to: string;
  /** Contract address (if created) */
  contractAddress?: string;
  /** Gas used */
  gasUsed: string;
  /** Status (1 = success, 0 = failure) */
  status: number;
  /** Logs */
  logs: any[];
  /** Number of confirmations */
  confirmations: number;
}

/**
 * Account information
 */
export interface AccountInfo {
  /** Account address */
  address: string;
  /** Account balance */
  balance: string;
  /** Account nonce */
  nonce: number;
  /** Whether the account is a contract */
  isContract: boolean;
  /** Contract code (if a contract) */
  code?: string;
  /** Contract storage (if a contract) */
  storage?: Record<string, string>;
}

/**
 * AI model metadata
 */
export interface AIModelMetadata {
  /** Model name */
  name: string;
  /** Model description */
  description: string;
  /** Model owner */
  owner: string;
  /** Model type */
  model_type: string;
  /** Model tags */
  tags?: string[];
}

/**
 * AI model
 */
export interface AIModel extends AIModelMetadata {
  /** Model ID */
  id: string;
  /** Creation timestamp */
  created_at: number;
  /** File path */
  file_path: string;
  /** File size in bytes */
  size_bytes: number;
  /** File hash */
  hash: string;
}

/**
 * Block data for AI proof
 */
export interface BlockData {
  /** Block height */
  height: number;
  /** Previous block hash */
  prev_hash: string;
  /** Block timestamp */
  timestamp: number;
  /** Transactions */
  transactions: any[];
}

/**
 * AI proof
 */
export interface AIProof {
  /** Nonce */
  nonce: number;
  /** Proof hash */
  hash: string;
  /** Confidence score */
  confidence: number;
  /** Timestamp */
  timestamp: number;
  /** Model ID */
  model_id: string;
  /** Whether the proof is valid */
  is_valid: boolean;
}

/**
 * Prediction result
 */
export interface PredictionResult {
  /** Model ID */
  model_id: string;
  /** Predictions */
  predictions: any[];
  /** Inference time in seconds */
  inference_time: number;
  /** Timestamp */
  timestamp: number;
}
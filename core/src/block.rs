use serde::{Serialize, Deserialize};
use sha2::{Sha256, Digest};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::transaction::Transaction;
use crate::crypto::Signature;

/// Block structure for the HyperNova blockchain
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    /// Block header containing metadata
    pub header: BlockHeader,
    /// List of transactions included in this block
    pub transactions: Vec<Transaction>,
    /// Validator signature
    pub validator_signature: Option<Signature>,
    /// AI proof data (for PoAI consensus)
    pub ai_proof: Option<Vec<u8>>,
}

/// Block header containing metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockHeader {
    /// Version of the block structure
    pub version: u32,
    /// Hash of the previous block
    pub prev_hash: String,
    /// Merkle root of transactions
    pub merkle_root: String,
    /// Timestamp when the block was created
    pub timestamp: u64,
    /// Block height in the chain
    pub height: u64,
    /// Difficulty target
    pub difficulty: u64,
    /// Nonce used for consensus
    pub nonce: u64,
    /// Shard ID (for sharding)
    pub shard_id: u32,
}

impl Block {
    /// Create a new block
    pub fn new(
        prev_hash: String,
        height: u64,
        transactions: Vec<Transaction>,
        shard_id: u32,
    ) -> Self {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
            
        let merkle_root = Self::calculate_merkle_root(&transactions);
        
        Block {
            header: BlockHeader {
                version: 1,
                prev_hash,
                merkle_root,
                timestamp,
                height,
                difficulty: 0, // Will be set by consensus
                nonce: 0,      // Will be set during mining
                shard_id,
            },
            transactions,
            validator_signature: None,
            ai_proof: None,
        }
    }
    
    /// Calculate the hash of this block
    pub fn hash(&self) -> String {
        let header_json = serde_json::to_string(&self.header).unwrap();
        let mut hasher = Sha256::new();
        hasher.update(header_json.as_bytes());
        format!("{:x}", hasher.finalize())
    }
    
    /// Calculate the Merkle root of transactions
    fn calculate_merkle_root(transactions: &[Transaction]) -> String {
        if transactions.is_empty() {
            return "0".repeat(64);
        }
        
        // Simple implementation - in production, use a proper Merkle tree
        let tx_strings: Vec<String> = transactions
            .iter()
            .map(|tx| serde_json::to_string(tx).unwrap())
            .collect();
            
        let concat = tx_strings.join("");
        let mut hasher = Sha256::new();
        hasher.update(concat.as_bytes());
        format!("{:x}", hasher.finalize())
    }
    
    /// Sign the block with validator's signature
    pub fn sign(&mut self, signature: Signature) {
        self.validator_signature = Some(signature);
    }
    
    /// Add AI proof to the block
    pub fn add_ai_proof(&mut self, proof: Vec<u8>) {
        self.ai_proof = Some(proof);
    }
}
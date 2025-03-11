use serde::{Serialize, Deserialize};
use sha2::{Sha256, Digest};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::crypto::Signature;

/// Transaction types supported by HyperNova Chain
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionType {
    /// Transfer of tokens
    Transfer,
    /// Smart contract deployment
    ContractDeploy,
    /// Smart contract call
    ContractCall,
    /// Validator registration
    ValidatorRegistration,
    /// AI model submission (for PoAI)
    AIModelSubmission,
    /// Governance proposal
    GovernanceProposal,
    /// Governance vote
    GovernanceVote,
}

/// Transaction structure for HyperNova Chain
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    /// Transaction type
    pub tx_type: TransactionType,
    /// Sender's address
    pub from: String,
    /// Recipient's address (if applicable)
    pub to: Option<String>,
    /// Amount of tokens (if applicable)
    pub amount: Option<u64>,
    /// Transaction data (e.g., contract bytecode, call data)
    pub data: Option<Vec<u8>>,
    /// Transaction fee
    pub fee: u64,
    /// Nonce to prevent replay attacks
    pub nonce: u64,
    /// Timestamp when the transaction was created
    pub timestamp: u64,
    /// Sender's signature
    pub signature: Option<Signature>,
    /// Quantum-resistant signature (if enabled)
    pub quantum_signature: Option<Vec<u8>>,
}

impl Transaction {
    /// Create a new transaction
    pub fn new(
        tx_type: TransactionType,
        from: String,
        to: Option<String>,
        amount: Option<u64>,
        data: Option<Vec<u8>>,
        fee: u64,
        nonce: u64,
    ) -> Self {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
            
        Transaction {
            tx_type,
            from,
            to,
            amount,
            data,
            fee,
            nonce,
            timestamp,
            signature: None,
            quantum_signature: None,
        }
    }
    
    /// Calculate the hash of this transaction
    pub fn hash(&self) -> String {
        // Create a copy without signatures for hashing
        let mut tx_copy = self.clone();
        tx_copy.signature = None;
        tx_copy.quantum_signature = None;
        
        let tx_json = serde_json::to_string(&tx_copy).unwrap();
        let mut hasher = Sha256::new();
        hasher.update(tx_json.as_bytes());
        format!("{:x}", hasher.finalize())
    }
    
    /// Sign the transaction with sender's signature
    pub fn sign(&mut self, signature: Signature) {
        self.signature = Some(signature);
    }
    
    /// Add quantum-resistant signature
    pub fn add_quantum_signature(&mut self, signature: Vec<u8>) {
        self.quantum_signature = Some(signature);
    }
    
    /// Verify the transaction signature
    pub fn verify_signature(&self) -> bool {
        // In a real implementation, this would verify the signature
        // against the sender's public key
        self.signature.is_some()
    }
}
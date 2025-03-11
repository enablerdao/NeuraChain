use std::collections::HashMap;
use std::path::Path;
use std::sync::{Arc, Mutex};
use log::{info, error};

use crate::block::Block;
use crate::transaction::Transaction;
use crate::storage::Storage;

/// Blockchain implementation for HyperNova Chain
pub struct Blockchain {
    /// Chain of blocks
    blocks: Arc<Mutex<Vec<Block>>>,
    /// Map of block hashes to block indices
    block_index: Arc<Mutex<HashMap<String, usize>>>,
    /// Pending transactions
    pending_transactions: Arc<Mutex<Vec<Transaction>>>,
    /// Storage backend
    storage: Box<dyn Storage>,
    /// Data directory
    data_dir: String,
}

impl Blockchain {
    /// Create a new blockchain instance
    pub fn new(data_dir: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let data_path = Path::new(data_dir);
        
        // Create data directory if it doesn't exist
        if !data_path.exists() {
            std::fs::create_dir_all(data_path)?;
        }
        
        // Initialize storage
        // In a real implementation, this would use the DistributedQuantumStorage
        let storage = Box::new(crate::storage::DistributedQuantumStorage::new(data_dir)?);
        
        let mut blockchain = Blockchain {
            blocks: Arc::new(Mutex::new(Vec::new())),
            block_index: Arc::new(Mutex::new(HashMap::new())),
            pending_transactions: Arc::new(Mutex::new(Vec::new())),
            storage,
            data_dir: data_dir.to_string(),
        };
        
        // Load existing chain or create genesis block
        if blockchain.load_chain().is_err() {
            info!("No existing blockchain found, creating genesis block");
            blockchain.create_genesis_block()?;
        }
        
        Ok(blockchain)
    }
    
    /// Create the genesis block
    fn create_genesis_block(&self) -> Result<(), Box<dyn std::error::Error>> {
        let genesis = Block::new(
            "0".repeat(64),
            0,
            Vec::new(),
            0, // Main shard
        );
        
        let hash = genesis.hash();
        
        // Store the genesis block
        self.storage.store_block(&genesis)?;
        
        // Add to in-memory structures
        let mut blocks = self.blocks.lock().unwrap();
        let mut block_index = self.block_index.lock().unwrap();
        
        blocks.push(genesis);
        block_index.insert(hash, 0);
        
        info!("Genesis block created with hash: {}", hash);
        
        Ok(())
    }
    
    /// Load the blockchain from storage
    fn load_chain(&self) -> Result<(), Box<dyn std::error::Error>> {
        let blocks = self.storage.load_blocks()?;
        
        if blocks.is_empty() {
            return Err("No blocks found in storage".into());
        }
        
        let mut blocks_lock = self.blocks.lock().unwrap();
        let mut block_index_lock = self.block_index.lock().unwrap();
        
        *blocks_lock = blocks;
        
        // Rebuild the block index
        for (i, block) in blocks_lock.iter().enumerate() {
            block_index_lock.insert(block.hash(), i);
        }
        
        info!("Loaded {} blocks from storage", blocks_lock.len());
        
        Ok(())
    }
    
    /// Add a new block to the chain
    pub fn add_block(&self, block: Block) -> Result<(), Box<dyn std::error::Error>> {
        let hash = block.hash();
        
        // Validate the block
        self.validate_block(&block)?;
        
        // Store the block
        self.storage.store_block(&block)?;
        
        // Add to in-memory structures
        let mut blocks = self.blocks.lock().unwrap();
        let mut block_index = self.block_index.lock().unwrap();
        
        let index = blocks.len();
        blocks.push(block);
        block_index.insert(hash, index);
        
        info!("Added block {} with hash: {}", index, hash);
        
        Ok(())
    }
    
    /// Validate a block
    fn validate_block(&self, block: &Block) -> Result<(), Box<dyn std::error::Error>> {
        let blocks = self.blocks.lock().unwrap();
        
        // Check if the chain is empty (only for genesis block)
        if blocks.is_empty() {
            if block.header.height != 0 {
                return Err("First block must be genesis block".into());
            }
            return Ok(());
        }
        
        // Get the latest block
        let latest_block = blocks.last().unwrap();
        
        // Check block height
        if block.header.height != latest_block.header.height + 1 {
            return Err(format!(
                "Invalid block height: expected {}, got {}",
                latest_block.header.height + 1,
                block.header.height
            ).into());
        }
        
        // Check previous hash
        if block.header.prev_hash != latest_block.hash() {
            return Err("Invalid previous hash".into());
        }
        
        // Validate transactions
        for tx in &block.transactions {
            if !tx.verify_signature() {
                return Err("Invalid transaction signature".into());
            }
        }
        
        // In a real implementation, this would also validate:
        // - Consensus rules (PoAI, DPoS)
        // - Quantum-resistant signatures
        // - Sharding rules
        
        Ok(())
    }
    
    /// Add a transaction to the pending pool
    pub fn add_transaction(&self, transaction: Transaction) -> Result<(), Box<dyn std::error::Error>> {
        // Validate the transaction
        if !transaction.verify_signature() {
            return Err("Invalid transaction signature".into());
        }
        
        // Add to pending transactions
        let mut pending = self.pending_transactions.lock().unwrap();
        pending.push(transaction);
        
        Ok(())
    }
    
    /// Get pending transactions
    pub fn get_pending_transactions(&self) -> Vec<Transaction> {
        let pending = self.pending_transactions.lock().unwrap();
        pending.clone()
    }
    
    /// Get the latest block
    pub fn get_latest_block(&self) -> Option<Block> {
        let blocks = self.blocks.lock().unwrap();
        blocks.last().cloned()
    }
    
    /// Get a block by hash
    pub fn get_block_by_hash(&self, hash: &str) -> Option<Block> {
        let block_index = self.block_index.lock().unwrap();
        let blocks = self.blocks.lock().unwrap();
        
        block_index.get(hash).map(|&index| blocks[index].clone())
    }
    
    /// Get a block by height
    pub fn get_block_by_height(&self, height: u64) -> Option<Block> {
        let blocks = self.blocks.lock().unwrap();
        
        blocks.iter()
            .find(|block| block.header.height == height)
            .cloned()
    }
    
    /// Get the current chain height
    pub fn get_height(&self) -> u64 {
        let blocks = self.blocks.lock().unwrap();
        
        match blocks.last() {
            Some(block) => block.header.height,
            None => 0,
        }
    }
}
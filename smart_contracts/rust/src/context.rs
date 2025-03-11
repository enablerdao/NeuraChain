use serde::{Serialize, Deserialize};
use borsh::{BorshSerialize, BorshDeserialize};

use crate::storage::Storage;

/// Execution context for smart contracts
#[derive(Debug, Clone)]
pub struct Context {
    /// Contract caller address
    pub caller: String,
    /// Contract address
    pub contract_address: String,
    /// Block height
    pub block_height: u64,
    /// Block timestamp
    pub block_timestamp: u64,
    /// Transaction hash
    pub tx_hash: String,
    /// Contract storage
    pub storage: Box<dyn Storage>,
    /// Gas limit
    pub gas_limit: u64,
    /// Gas used
    pub gas_used: u64,
}

impl Context {
    /// Create a new context
    pub fn new(
        caller: String,
        contract_address: String,
        block_height: u64,
        block_timestamp: u64,
        tx_hash: String,
        storage: Box<dyn Storage>,
        gas_limit: u64,
    ) -> Self {
        Context {
            caller,
            contract_address,
            block_height,
            block_timestamp,
            tx_hash,
            storage,
            gas_limit,
            gas_used: 0,
        }
    }
    
    /// Check if the caller is the contract owner
    pub fn is_owner(&self) -> bool {
        // In a real implementation, this would check if the caller is the contract owner
        // For now, just return true
        true
    }
    
    /// Use gas
    pub fn use_gas(&mut self, amount: u64) -> Result<(), String> {
        let new_gas_used = self.gas_used.checked_add(amount)
            .ok_or_else(|| "Gas overflow".to_string())?;
            
        if new_gas_used > self.gas_limit {
            return Err("Out of gas".to_string());
        }
        
        self.gas_used = new_gas_used;
        Ok(())
    }
    
    /// Get remaining gas
    pub fn remaining_gas(&self) -> u64 {
        self.gas_limit.saturating_sub(self.gas_used)
    }
}
use serde::{Serialize, Deserialize};
use borsh::{BorshSerialize, BorshDeserialize};
use std::collections::HashMap;

use crate::contract::{Contract, ContractMetadata, ContractMethod, MethodType, ContractParam};
use crate::context::Context;
use crate::error::ContractError;
use crate::storage::StorageHelpers;

/// Token contract implementation
#[derive(Debug, Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct Token {
    /// Token name
    pub name: String,
    /// Token symbol
    pub symbol: String,
    /// Token decimals
    pub decimals: u8,
    /// Total supply
    pub total_supply: u64,
    /// Token owner
    pub owner: String,
    /// Balances by address
    pub balances: HashMap<String, u64>,
    /// Allowances by owner and spender
    pub allowances: HashMap<String, HashMap<String, u64>>,
}

impl Token {
    /// Create a new token contract
    pub fn new(name: String, symbol: String, decimals: u8, initial_supply: u64, owner: String) -> Self {
        let mut balances = HashMap::new();
        balances.insert(owner.clone(), initial_supply);
        
        Token {
            name,
            symbol,
            decimals,
            total_supply: initial_supply,
            owner,
            balances,
            allowances: HashMap::new(),
        }
    }
    
    /// Get contract metadata
    pub fn metadata() -> ContractMetadata {
        ContractMetadata {
            name: "HyperNova Token".to_string(),
            version: "0.1.0".to_string(),
            author: "HyperNova Chain Team".to_string(),
            description: "Standard token implementation for HyperNova Chain".to_string(),
            methods: vec![
                ContractMethod {
                    name: "transfer".to_string(),
                    method_type: MethodType::Execute,
                    description: "Transfer tokens to another address".to_string(),
                    params: vec![
                        ContractParam {
                            name: "to".to_string(),
                            param_type: "string".to_string(),
                            description: "Recipient address".to_string(),
                        },
                        ContractParam {
                            name: "amount".to_string(),
                            param_type: "u64".to_string(),
                            description: "Amount to transfer".to_string(),
                        },
                    ],
                    return_type: "bool".to_string(),
                },
                ContractMethod {
                    name: "balance_of".to_string(),
                    method_type: MethodType::Query,
                    description: "Get the balance of an address".to_string(),
                    params: vec![
                        ContractParam {
                            name: "address".to_string(),
                            param_type: "string".to_string(),
                            description: "Address to query".to_string(),
                        },
                    ],
                    return_type: "u64".to_string(),
                },
                // Add more methods here
            ],
        }
    }
    
    /// Transfer tokens
    fn transfer(&mut self, to: String, amount: u64) -> Result<bool, ContractError> {
        let from = self.owner.clone();
        
        // Check if sender has enough balance
        let from_balance = *self.balances.get(&from).unwrap_or(&0);
        if from_balance < amount {
            return Err(ContractError::InsufficientFunds(format!(
                "Insufficient balance: {} < {}",
                from_balance, amount
            )));
        }
        
        // Update balances
        *self.balances.entry(from).or_insert(0) -= amount;
        *self.balances.entry(to).or_insert(0) += amount;
        
        Ok(true)
    }
    
    /// Get balance of an address
    fn balance_of(&self, address: String) -> Result<u64, ContractError> {
        Ok(*self.balances.get(&address).unwrap_or(&0))
    }
}

impl Contract for Token {
    fn init(&mut self, ctx: &Context) -> Result<(), ContractError> {
        // Save the contract state
        ctx.storage.set_object(b"state", self)
            .map_err(|e| ContractError::Storage(e))?;
        
        Ok(())
    }
    
    fn execute(&mut self, ctx: &Context, method: &str, args: &[u8]) -> Result<Vec<u8>, ContractError> {
        match method {
            "transfer" => {
                // Parse arguments
                let params: (String, u64) = serde_json::from_slice(args)
                    .map_err(|e| ContractError::Deserialization(e.to_string()))?;
                
                // Execute transfer
                let result = self.transfer(params.0, params.1)?;
                
                // Save updated state
                ctx.storage.set_object(b"state", self)
                    .map_err(|e| ContractError::Storage(e))?;
                
                // Return result
                serde_json::to_vec(&result)
                    .map_err(|e| ContractError::Serialization(e.to_string()))
            }
            _ => Err(ContractError::MethodNotFound(method.to_string())),
        }
    }
    
    fn query(&self, _ctx: &Context, method: &str, args: &[u8]) -> Result<Vec<u8>, ContractError> {
        match method {
            "balance_of" => {
                // Parse arguments
                let address: String = serde_json::from_slice(args)
                    .map_err(|e| ContractError::Deserialization(e.to_string()))?;
                
                // Execute query
                let result = self.balance_of(address)?;
                
                // Return result
                serde_json::to_vec(&result)
                    .map_err(|e| ContractError::Serialization(e.to_string()))
            }
            _ => Err(ContractError::MethodNotFound(method.to_string())),
        }
    }
}
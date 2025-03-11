use serde::{Serialize, Deserialize};
use borsh::{BorshSerialize, BorshDeserialize};
use std::collections::HashMap;

use crate::contract::{Contract, ContractMetadata, ContractMethod, MethodType, ContractParam};
use crate::context::Context;
use crate::error::ContractError;
use crate::storage::StorageHelpers;

/// AI model metadata
#[derive(Debug, Clone, Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct ModelMetadata {
    /// Model name
    pub name: String,
    /// Model description
    pub description: String,
    /// Model version
    pub version: String,
    /// Model author
    pub author: String,
    /// Model creation date
    pub created_at: u64,
    /// Model tags
    pub tags: Vec<String>,
    /// Model license
    pub license: String,
}

/// AI model contract implementation
#[derive(Debug, Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct AIModel {
    /// Model owner
    pub owner: String,
    /// Model metadata
    pub metadata: ModelMetadata,
    /// Model hash (IPFS or other content-addressable storage)
    pub model_hash: String,
    /// Access price in tokens
    pub access_price: u64,
    /// Authorized users
    pub authorized_users: HashMap<String, u64>, // Address -> Expiration timestamp
    /// Model metrics and ratings
    pub ratings: Vec<(String, u8)>, // (Address, Rating 1-5)
    /// Total usage count
    pub usage_count: u64,
}

impl AIModel {
    /// Create a new AI model contract
    pub fn new(
        owner: String,
        metadata: ModelMetadata,
        model_hash: String,
        access_price: u64,
    ) -> Self {
        AIModel {
            owner,
            metadata,
            model_hash,
            access_price,
            authorized_users: HashMap::new(),
            ratings: Vec::new(),
            usage_count: 0,
        }
    }
    
    /// Get contract metadata
    pub fn metadata() -> ContractMetadata {
        ContractMetadata {
            name: "HyperNova AI Model".to_string(),
            version: "0.1.0".to_string(),
            author: "HyperNova Chain Team".to_string(),
            description: "AI model sharing contract for HyperNova Chain".to_string(),
            methods: vec![
                ContractMethod {
                    name: "purchase_access".to_string(),
                    method_type: MethodType::Execute,
                    description: "Purchase access to the AI model".to_string(),
                    params: vec![
                        ContractParam {
                            name: "duration".to_string(),
                            param_type: "u64".to_string(),
                            description: "Access duration in seconds".to_string(),
                        },
                    ],
                    return_type: "bool".to_string(),
                },
                ContractMethod {
                    name: "rate_model".to_string(),
                    method_type: MethodType::Execute,
                    description: "Rate the AI model".to_string(),
                    params: vec![
                        ContractParam {
                            name: "rating".to_string(),
                            param_type: "u8".to_string(),
                            description: "Rating (1-5)".to_string(),
                        },
                    ],
                    return_type: "bool".to_string(),
                },
                ContractMethod {
                    name: "get_model_info".to_string(),
                    method_type: MethodType::Query,
                    description: "Get model information".to_string(),
                    params: vec![],
                    return_type: "ModelInfo".to_string(),
                },
                ContractMethod {
                    name: "check_access".to_string(),
                    method_type: MethodType::Query,
                    description: "Check if an address has access to the model".to_string(),
                    params: vec![
                        ContractParam {
                            name: "address".to_string(),
                            param_type: "string".to_string(),
                            description: "Address to check".to_string(),
                        },
                    ],
                    return_type: "bool".to_string(),
                },
            ],
        }
    }
    
    /// Purchase access to the model
    fn purchase_access(&mut self, ctx: &Context, duration: u64) -> Result<bool, ContractError> {
        let caller = ctx.caller.clone();
        let current_time = ctx.block_timestamp;
        let expiration = current_time + duration;
        
        // In a real implementation, this would transfer tokens from the caller to the owner
        
        // Grant access
        self.authorized_users.insert(caller, expiration);
        
        Ok(true)
    }
    
    /// Rate the model
    fn rate_model(&mut self, ctx: &Context, rating: u8) -> Result<bool, ContractError> {
        let caller = ctx.caller.clone();
        
        // Validate rating
        if rating < 1 || rating > 5 {
            return Err(ContractError::InvalidArgument("Rating must be between 1 and 5".to_string()));
        }
        
        // Check if user has access
        if !self.has_access(&caller, ctx.block_timestamp) {
            return Err(ContractError::Unauthorized("Must have access to rate the model".to_string()));
        }
        
        // Remove existing rating if any
        self.ratings.retain(|(addr, _)| addr != &caller);
        
        // Add new rating
        self.ratings.push((caller, rating));
        
        Ok(true)
    }
    
    /// Get model information
    fn get_model_info(&self) -> Result<ModelInfo, ContractError> {
        let avg_rating = if self.ratings.is_empty() {
            0.0
        } else {
            let sum: u32 = self.ratings.iter().map(|(_, r)| *r as u32).sum();
            sum as f64 / self.ratings.len() as f64
        };
        
        Ok(ModelInfo {
            metadata: self.metadata.clone(),
            owner: self.owner.clone(),
            model_hash: self.model_hash.clone(),
            access_price: self.access_price,
            rating_count: self.ratings.len() as u32,
            average_rating: avg_rating,
            usage_count: self.usage_count,
        })
    }
    
    /// Check if an address has access to the model
    fn check_access(&self, address: String, current_time: u64) -> Result<bool, ContractError> {
        Ok(self.has_access(&address, current_time))
    }
    
    /// Helper to check if an address has access
    fn has_access(&self, address: &str, current_time: u64) -> bool {
        match self.authorized_users.get(address) {
            Some(&expiration) => expiration > current_time,
            None => false,
        }
    }
}

/// Model information for queries
#[derive(Debug, Serialize, Deserialize)]
pub struct ModelInfo {
    /// Model metadata
    pub metadata: ModelMetadata,
    /// Model owner
    pub owner: String,
    /// Model hash
    pub model_hash: String,
    /// Access price
    pub access_price: u64,
    /// Number of ratings
    pub rating_count: u32,
    /// Average rating
    pub average_rating: f64,
    /// Total usage count
    pub usage_count: u64,
}

impl Contract for AIModel {
    fn init(&mut self, ctx: &Context) -> Result<(), ContractError> {
        // Save the contract state
        ctx.storage.set_object(b"state", self)
            .map_err(|e| ContractError::Storage(e))?;
        
        Ok(())
    }
    
    fn execute(&mut self, ctx: &Context, method: &str, args: &[u8]) -> Result<Vec<u8>, ContractError> {
        match method {
            "purchase_access" => {
                // Parse arguments
                let duration: u64 = serde_json::from_slice(args)
                    .map_err(|e| ContractError::Deserialization(e.to_string()))?;
                
                // Execute purchase
                let result = self.purchase_access(ctx, duration)?;
                
                // Save updated state
                ctx.storage.set_object(b"state", self)
                    .map_err(|e| ContractError::Storage(e))?;
                
                // Return result
                serde_json::to_vec(&result)
                    .map_err(|e| ContractError::Serialization(e.to_string()))
            }
            "rate_model" => {
                // Parse arguments
                let rating: u8 = serde_json::from_slice(args)
                    .map_err(|e| ContractError::Deserialization(e.to_string()))?;
                
                // Execute rating
                let result = self.rate_model(ctx, rating)?;
                
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
    
    fn query(&self, ctx: &Context, method: &str, args: &[u8]) -> Result<Vec<u8>, ContractError> {
        match method {
            "get_model_info" => {
                // Execute query
                let result = self.get_model_info()?;
                
                // Return result
                serde_json::to_vec(&result)
                    .map_err(|e| ContractError::Serialization(e.to_string()))
            }
            "check_access" => {
                // Parse arguments
                let address: String = serde_json::from_slice(args)
                    .map_err(|e| ContractError::Deserialization(e.to_string()))?;
                
                // Execute query
                let result = self.check_access(address, ctx.block_timestamp)?;
                
                // Return result
                serde_json::to_vec(&result)
                    .map_err(|e| ContractError::Serialization(e.to_string()))
            }
            _ => Err(ContractError::MethodNotFound(method.to_string())),
        }
    }
}
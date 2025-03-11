use serde::{Serialize, Deserialize};
use borsh::{BorshSerialize, BorshDeserialize};

use crate::context::Context;
use crate::error::ContractError;

/// Trait for HyperNova smart contracts
pub trait Contract {
    /// Initialize the contract
    fn init(&mut self, ctx: &Context) -> Result<(), ContractError>;
    
    /// Execute a contract method
    fn execute(&mut self, ctx: &Context, method: &str, args: &[u8]) -> Result<Vec<u8>, ContractError>;
    
    /// Query contract state
    fn query(&self, ctx: &Context, method: &str, args: &[u8]) -> Result<Vec<u8>, ContractError>;
}

/// Contract metadata
#[derive(Debug, Clone, Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct ContractMetadata {
    /// Contract name
    pub name: String,
    /// Contract version
    pub version: String,
    /// Contract author
    pub author: String,
    /// Contract description
    pub description: String,
    /// Supported methods
    pub methods: Vec<ContractMethod>,
}

/// Contract method definition
#[derive(Debug, Clone, Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct ContractMethod {
    /// Method name
    pub name: String,
    /// Method type (execute or query)
    pub method_type: MethodType,
    /// Method description
    pub description: String,
    /// Method parameters
    pub params: Vec<ContractParam>,
    /// Method return type
    pub return_type: String,
}

/// Method type
#[derive(Debug, Clone, Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub enum MethodType {
    /// Execute method (modifies state)
    Execute,
    /// Query method (read-only)
    Query,
}

/// Contract parameter definition
#[derive(Debug, Clone, Serialize, Deserialize, BorshSerialize, BorshDeserialize)]
pub struct ContractParam {
    /// Parameter name
    pub name: String,
    /// Parameter type
    pub param_type: String,
    /// Parameter description
    pub description: String,
}
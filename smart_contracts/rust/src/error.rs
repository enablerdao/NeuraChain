use thiserror::Error;

/// Smart contract error types
#[derive(Error, Debug)]
pub enum ContractError {
    #[error("Serialization error: {0}")]
    Serialization(String),
    
    #[error("Deserialization error: {0}")]
    Deserialization(String),
    
    #[error("Storage error: {0}")]
    Storage(String),
    
    #[error("Unauthorized: {0}")]
    Unauthorized(String),
    
    #[error("Invalid argument: {0}")]
    InvalidArgument(String),
    
    #[error("Method not found: {0}")]
    MethodNotFound(String),
    
    #[error("Insufficient funds: {0}")]
    InsufficientFunds(String),
    
    #[error("Out of gas")]
    OutOfGas,
    
    #[error("Contract error: {0}")]
    ContractError(String),
    
    #[error("AI model error: {0}")]
    AIModelError(String),
}

impl From<serde_json::Error> for ContractError {
    fn from(err: serde_json::Error) -> Self {
        ContractError::Serialization(err.to_string())
    }
}

impl From<std::io::Error> for ContractError {
    fn from(err: std::io::Error) -> Self {
        ContractError::Storage(err.to_string())
    }
}
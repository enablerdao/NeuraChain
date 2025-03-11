use serde::{Serialize, Deserialize};

/// Storage trait for smart contracts
pub trait Storage {
    /// Get a value from storage
    fn get(&self, key: &[u8]) -> Result<Option<Vec<u8>>, String>;
    
    /// Set a value in storage
    fn set(&mut self, key: &[u8], value: &[u8]) -> Result<(), String>;
    
    /// Remove a value from storage
    fn remove(&mut self, key: &[u8]) -> Result<(), String>;
    
    /// Check if a key exists in storage
    fn contains(&self, key: &[u8]) -> Result<bool, String>;
}

/// Helper methods for storage
pub trait StorageHelpers {
    /// Get a value and deserialize it
    fn get_object<T: for<'a> Deserialize<'a>>(&self, key: &[u8]) -> Result<Option<T>, String>;
    
    /// Serialize an object and store it
    fn set_object<T: Serialize>(&mut self, key: &[u8], value: &T) -> Result<(), String>;
}

impl<S: Storage> StorageHelpers for S {
    fn get_object<T: for<'a> Deserialize<'a>>(&self, key: &[u8]) -> Result<Option<T>, String> {
        match self.get(key)? {
            Some(data) => {
                let obj = serde_json::from_slice(&data)
                    .map_err(|e| format!("Failed to deserialize: {}", e))?;
                Ok(Some(obj))
            }
            None => Ok(None),
        }
    }
    
    fn set_object<T: Serialize>(&mut self, key: &[u8], value: &T) -> Result<(), String> {
        let data = serde_json::to_vec(value)
            .map_err(|e| format!("Failed to serialize: {}", e))?;
        self.set(key, &data)
    }
}
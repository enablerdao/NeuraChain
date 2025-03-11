use sha2::{Sha256, Digest};

/// Calculate SHA-256 hash of data
pub fn sha256(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    format!("{:x}", hasher.finalize())
}

/// Convert a hex string to bytes
pub fn hex_to_bytes(hex: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let hex = hex.trim_start_matches("0x");
    
    if hex.len() % 2 != 0 {
        return Err("Invalid hex string length".into());
    }
    
    let mut bytes = Vec::with_capacity(hex.len() / 2);
    
    for i in (0..hex.len()).step_by(2) {
        let byte = u8::from_str_radix(&hex[i..i+2], 16)?;
        bytes.push(byte);
    }
    
    Ok(bytes)
}

/// Convert bytes to a hex string
pub fn bytes_to_hex(bytes: &[u8]) -> String {
    bytes.iter()
        .map(|b| format!("{:02x}", b))
        .collect()
}

/// Generate a random nonce
pub fn random_nonce() -> u64 {
    use rand::Rng;
    rand::thread_rng().gen()
}

/// Format a timestamp as a human-readable date/time
pub fn format_timestamp(timestamp: u64) -> String {
    use std::time::{Duration, UNIX_EPOCH};
    
    let datetime = UNIX_EPOCH + Duration::from_secs(timestamp);
    let datetime = chrono::DateTime::<chrono::Utc>::from(datetime);
    
    datetime.format("%Y-%m-%d %H:%M:%S UTC").to_string()
}
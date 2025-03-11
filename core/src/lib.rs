pub mod block;
pub mod chain;
pub mod consensus;
pub mod crypto;
pub mod network;
pub mod storage;
pub mod transaction;
pub mod utils;

pub use block::Block;
pub use chain::Blockchain;
pub use consensus::{Consensus, ProofOfAI, DelegatedProofOfStake};
pub use crypto::{KeyPair, Signature, QuantumResistantCrypto};
pub use network::P2PNetwork;
pub use storage::{Storage, DistributedQuantumStorage};
pub use transaction::Transaction;

/// HyperNova Chain version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Initialize the HyperNova Chain core library
pub fn init() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    env_logger::init();
    
    // Return success
    Ok(())
}
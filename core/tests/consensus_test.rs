#[cfg(test)]
mod tests {
    use hypernova_core::{
        block::Block,
        chain::Blockchain,
        consensus::{Consensus, ProofOfAI, DelegatedProofOfStake},
    };

    #[test]
    fn test_proof_of_ai_consensus() {
        // Create a ProofOfAI instance
        let proof_of_ai = ProofOfAI::new("test_model", 0.75);
        
        // Create a mock blockchain
        let blockchain = Blockchain::new("test_data").unwrap();
        
        // Create a block
        let block = proof_of_ai.create_block(&blockchain).unwrap();
        
        // Validate the block
        let result = proof_of_ai.validate_block(&block, &blockchain);
        
        // The validation should succeed
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_delegated_proof_of_stake_consensus() {
        // Create a DPoS instance
        let dpos = DelegatedProofOfStake::new(21, 1000);
        
        // Create a mock blockchain
        let blockchain = Blockchain::new("test_data").unwrap();
        
        // Create a block
        let block = dpos.create_block(&blockchain).unwrap();
        
        // Validate the block
        let result = dpos.validate_block(&block, &blockchain);
        
        // The validation should succeed
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_hybrid_consensus() {
        // Create a ProofOfAI instance
        let proof_of_ai = ProofOfAI::new("test_model", 0.75);
        
        // Create a DPoS instance
        let dpos = DelegatedProofOfStake::new(21, 1000);
        
        // Create a mock blockchain
        let blockchain = Blockchain::new("test_data").unwrap();
        
        // Create a block using ProofOfAI
        let block = proof_of_ai.create_block(&blockchain).unwrap();
        
        // Validate the block using DPoS
        let result = dpos.validate_block(&block, &blockchain);
        
        // The validation should fail because the block doesn't have a validator signature
        assert!(result.is_err());
        
        // Create a block using DPoS
        let block = dpos.create_block(&blockchain).unwrap();
        
        // Validate the block using ProofOfAI
        let result = proof_of_ai.validate_block(&block, &blockchain);
        
        // The validation should fail because the block doesn't have an AI proof
        assert!(result.is_err());
    }
}
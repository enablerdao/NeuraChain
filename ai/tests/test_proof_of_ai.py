import unittest
import numpy as np
from src.proof_of_ai import ProofOfAI, AIValidator

class TestProofOfAI(unittest.TestCase):
    def setUp(self):
        # Create a ProofOfAI instance for testing
        self.proof_of_ai = ProofOfAI(model_path="test_model", difficulty=0.75)
        
        # Create a mock block data
        self.block_data = {
            "height": 1000,
            "prev_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "timestamp": 1625097600,
            "transactions": [
                {"hash": "0x1234", "amount": 100},
                {"hash": "0x5678", "amount": 200},
                {"hash": "0x9012", "amount": 300},
            ]
        }
    
    def test_generate_proof(self):
        # Generate a proof
        proof = self.proof_of_ai.generate_proof(self.block_data)
        
        # Check that the proof has the expected fields
        self.assertIn("nonce", proof)
        self.assertIn("hash", proof)
        self.assertIn("confidence", proof)
        self.assertIn("timestamp", proof)
        self.assertIn("model_id", proof)
        
        # Check that the confidence meets the difficulty requirement
        self.assertGreaterEqual(proof["confidence"], self.proof_of_ai.difficulty)
        
        # Check that the hash is a valid hex string
        self.assertTrue(all(c in "0123456789abcdef" for c in proof["hash"]))
    
    def test_verify_proof(self):
        # Generate a proof
        proof = self.proof_of_ai.generate_proof(self.block_data)
        
        # Verify the proof
        is_valid = self.proof_of_ai.verify_proof(self.block_data, proof)
        
        # The proof should be valid
        self.assertTrue(is_valid)
        
        # Modify the block data
        modified_block_data = self.block_data.copy()
        modified_block_data["height"] = 1001
        
        # Verify the proof with modified block data
        is_valid = self.proof_of_ai.verify_proof(modified_block_data, proof)
        
        # The proof should be invalid
        self.assertFalse(is_valid)
    
    def test_prepare_input(self):
        # Prepare input data
        input_data = self.proof_of_ai._prepare_input(self.block_data)
        
        # Check that the input data has the expected shape
        self.assertEqual(input_data.shape, (1, 10))
        
        # Check that the input data is a numpy array
        self.assertIsInstance(input_data, np.ndarray)
        
        # Check that the input data has the expected dtype
        self.assertEqual(input_data.dtype, np.float32)
    
    def test_run_model(self):
        # Prepare input data
        input_data = self.proof_of_ai._prepare_input(self.block_data)
        
        # Run the model
        predictions = self.proof_of_ai._run_model(input_data)
        
        # Check that the predictions have the expected shape
        self.assertEqual(predictions.shape, (1, 1))
        
        # Check that the predictions are a numpy array
        self.assertIsInstance(predictions, np.ndarray)
        
        # Check that the predictions have the expected dtype
        self.assertEqual(predictions.dtype, np.float32)
        
        # Check that the predictions are between 0 and 1
        self.assertTrue(np.all(predictions >= 0) and np.all(predictions <= 1))
    
    def test_find_valid_nonce(self):
        # Prepare input data
        input_data = self.proof_of_ai._prepare_input(self.block_data)
        
        # Run the model
        predictions = self.proof_of_ai._run_model(input_data)
        
        # Find a valid nonce
        nonce, proof_hash, confidence = self.proof_of_ai._find_valid_nonce(self.block_data, predictions)
        
        # Check that the nonce is a non-negative integer
        self.assertIsInstance(nonce, int)
        self.assertGreaterEqual(nonce, 0)
        
        # Check that the proof hash is a valid hex string
        self.assertTrue(all(c in "0123456789abcdef" for c in proof_hash))
        
        # Check that the confidence meets the difficulty requirement
        self.assertGreaterEqual(confidence, self.proof_of_ai.difficulty)
    
    def test_compute_proof_hash(self):
        # Compute the proof hash
        proof_hash = self.proof_of_ai._compute_proof_hash(self.block_data)
        
        # Check that the proof hash is a valid hex string
        self.assertTrue(all(c in "0123456789abcdef" for c in proof_hash))
        
        # Check that the proof hash has the expected length
        self.assertEqual(len(proof_hash), 64)
    
    def test_get_model_id(self):
        # Get the model ID
        model_id = self.proof_of_ai._get_model_id()
        
        # Check that the model ID is a string
        self.assertIsInstance(model_id, str)
        
        # Check that the model ID has the expected length
        self.assertEqual(len(model_id), 16)


class TestAIValidator(unittest.TestCase):
    def setUp(self):
        # Create a ProofOfAI instance for testing
        self.proof_of_ai = ProofOfAI(model_path="test_model", difficulty=0.75)
        
        # Create an AIValidator instance for testing
        self.validator = AIValidator(
            validator_address="0x1234567890abcdef1234567890abcdef12345678",
            proof_of_ai=self.proof_of_ai,
            stake=1000000
        )
        
        # Create a mock block data
        self.block_data = {
            "height": 1000,
            "prev_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "timestamp": 1625097600,
            "transactions": [
                {"hash": "0x1234", "amount": 100},
                {"hash": "0x5678", "amount": 200},
                {"hash": "0x9012", "amount": 300},
            ]
        }
    
    def test_validate_block(self):
        # Validate the block
        result = self.validator.validate_block(self.block_data)
        
        # Check that the result has the expected fields
        self.assertIn("validator", result)
        self.assertIn("block_height", result)
        self.assertIn("is_valid", result)
        self.assertIn("proof", result)
        self.assertIn("timestamp", result)
        
        # Check that the validator address is correct
        self.assertEqual(result["validator"], self.validator.address)
        
        # Check that the block height is correct
        self.assertEqual(result["block_height"], self.block_data["height"])
        
        # Check that the block is valid
        self.assertTrue(result["is_valid"])
        
        # Check that the proof is valid
        proof = result["proof"]
        is_valid = self.proof_of_ai.verify_proof(self.block_data, proof)
        self.assertTrue(is_valid)
    
    def test_get_validation_score(self):
        # Get the validation score
        score = self.validator.get_validation_score()
        
        # Check that the score is a float
        self.assertIsInstance(score, float)
        
        # Check that the score is between 0 and 1
        self.assertGreaterEqual(score, 0)
        self.assertLessEqual(score, 1)
        
        # Validate a block to increase the validated_blocks count
        self.validator.validate_block(self.block_data)
        
        # Get the validation score again
        new_score = self.validator.get_validation_score()
        
        # Check that the score has increased
        self.assertGreater(new_score, score)


if __name__ == "__main__":
    unittest.main()
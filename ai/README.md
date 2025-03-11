# HyperNova Chain AI Module

This module provides AI functionality for the HyperNova Chain blockchain, including:

- Proof of AI (PoAI) consensus mechanism
- AI model management and inference
- AI-assisted governance
- Quantum-resistant cryptography integration

## Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `models` directory for storing AI models:

```bash
mkdir -p models
```

## Usage

### Running the API Server

To start the AI API server:

```bash
python run_api.py
```

By default, the server runs on `http://0.0.0.0:8000`. You can customize the host and port using environment variables:

```bash
HOST=127.0.0.1 PORT=8080 python run_api.py
```

### API Endpoints

The API provides the following endpoints:

- `GET /`: API information
- `POST /models/register`: Register a new AI model
- `GET /models/list`: List available models
- `GET /models/{model_id}`: Get model details
- `DELETE /models/{model_id}`: Delete a model
- `POST /models/predict`: Make predictions using a model
- `POST /consensus/generate_proof`: Generate an AI proof for a block
- `POST /consensus/verify_proof`: Verify an AI proof for a block

### Proof of AI (PoAI)

The Proof of AI consensus mechanism uses AI models to validate blocks. To generate a proof:

```python
from src.proof_of_ai import ProofOfAI

# Initialize PoAI with a model
proof_of_ai = ProofOfAI(model_path="models/consensus_model.h5")

# Generate proof for a block
block_data = {
    "height": 1000,
    "prev_hash": "0x1234...",
    "timestamp": 1625097600,
    "transactions": [...]
}
proof = proof_of_ai.generate_proof(block_data)

# Verify the proof
is_valid = proof_of_ai.verify_proof(block_data, proof)
```

### Model Management

The Model Manager allows you to register, retrieve, and manage AI models:

```python
from src.model_manager import ModelManager

# Initialize the model manager
model_manager = ModelManager("models")

# Register a new model
model_id = model_manager.register_model(
    model_path="path/to/model.h5",
    name="My Model",
    description="A description of my model",
    owner="0x1234...",
    model_type="tensorflow",
    tags=["tag1", "tag2"]
)

# Get model details
model = model_manager.get_model(model_id)

# List models
models = model_manager.list_models()
```

### AI-Assisted Governance

The Governance AI provides tools for analyzing proposals and predicting vote outcomes:

```python
from src.governance import GovernanceAI

# Initialize the governance AI
governance_ai = GovernanceAI()

# Analyze a proposal
proposal = {
    "id": "prop1",
    "title": "Increase block size",
    "description": "This proposal suggests increasing the block size to improve throughput.",
    "proposer": "0x1234...",
    "start_time": 1625097600,
    "end_time": 1625184000
}
analysis = governance_ai.analyze_proposal(proposal)

# Predict vote outcome
prediction = governance_ai.predict_vote_outcome("prop1")

# Generate a voting recommendation
recommendation = governance_ai.recommend_vote("prop1", "0x5678...")
```

## Development

### Project Structure

- `src/`: Source code
  - `proof_of_ai.py`: Proof of AI consensus implementation
  - `model_manager.py`: AI model management
  - `governance.py`: AI-assisted governance
  - `api.py`: FastAPI server
- `models/`: AI model storage
- `tests/`: Unit tests

### Running Tests

```bash
pytest
```

## License

[License information]
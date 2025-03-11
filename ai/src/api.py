from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import os
import json
import numpy as np
import tempfile
import uvicorn
import time

from .proof_of_ai import ProofOfAI, AIValidator
from .model_manager import ModelManager, ModelInference

# Create FastAPI app
app = FastAPI(
    title="HyperNova Chain AI API",
    description="API for AI functionality in HyperNova Chain",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models directory
MODELS_DIR = os.environ.get("MODELS_DIR", "models")

# Initialize components
model_manager = ModelManager(MODELS_DIR)
model_inference = ModelInference(model_manager)

# Pydantic models for API
class ModelMetadata(BaseModel):
    name: str
    description: str
    owner: str
    model_type: str
    tags: List[str] = []

class BlockData(BaseModel):
    height: int
    prev_hash: str
    timestamp: int
    transactions: List[Dict] = []
    
class ProofRequest(BaseModel):
    block_data: BlockData
    model_id: Optional[str] = None
    
class ProofResponse(BaseModel):
    nonce: int
    hash: str
    confidence: float
    timestamp: int
    model_id: str
    is_valid: bool
    
class PredictionRequest(BaseModel):
    model_id: str
    input_data: List[Any]
    user_address: Optional[str] = None
    
class PredictionResponse(BaseModel):
    model_id: str
    predictions: List[Any]
    inference_time: float
    timestamp: int

# API routes
@app.get("/")
async def root():
    return {"message": "HyperNova Chain AI API"}

@app.post("/models/register")
async def register_model(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(...),
    owner: str = Form(...),
    model_type: str = Form(...),
    tags: str = Form("[]")
):
    """Register a new AI model."""
    try:
        # Parse tags
        tags_list = json.loads(tags)
        
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name
        
        # Register the model
        model_id = model_manager.register_model(
            model_path=temp_path,
            name=name,
            description=description,
            owner=owner,
            model_type=model_type,
            tags=tags_list
        )
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        return {"model_id": model_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/models/list")
async def list_models(owner: Optional[str] = None, tag: Optional[str] = None):
    """List available models."""
    try:
        tags = [tag] if tag else None
        models = model_manager.list_models(owner=owner, tags=tags)
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/models/{model_id}")
async def get_model(model_id: str):
    """Get model metadata."""
    model = model_manager.get_model(model_id)
    if model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

@app.delete("/models/{model_id}")
async def delete_model(model_id: str, owner: str):
    """Delete a model."""
    success = model_manager.delete_model(model_id, owner)
    if not success:
        raise HTTPException(status_code=404, detail="Model not found or not authorized")
    return {"success": True}

@app.post("/models/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Make predictions using a model."""
    try:
        results = model_inference.predict(
            model_id=request.model_id,
            input_data=np.array(request.input_data),
            user_address=request.user_address
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/consensus/generate_proof", response_model=ProofResponse)
async def generate_proof(request: ProofRequest):
    """Generate an AI proof for a block."""
    try:
        # Use the specified model or a default one
        model_id = request.model_id
        if model_id is None:
            # Get the first available model
            models = model_manager.list_models()
            if not models:
                raise HTTPException(status_code=400, detail="No models available")
            model_id = models[0]["id"]
        
        # Get model metadata
        model = model_manager.get_model(model_id)
        if model is None:
            raise HTTPException(status_code=404, detail="Model not found")
        
        # Create ProofOfAI instance
        proof_of_ai = ProofOfAI(model_path=model["file_path"])
        
        # Generate proof
        proof = proof_of_ai.generate_proof(request.block_data.dict())
        
        # Verify proof
        is_valid = proof_of_ai.verify_proof(request.block_data.dict(), proof)
        
        # Add validation result
        proof["is_valid"] = is_valid
        
        return proof
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/consensus/verify_proof")
async def verify_proof(
    block_data: BlockData,
    proof: Dict = Body(...)
):
    """Verify an AI proof for a block."""
    try:
        # Get model metadata
        model_id = proof.get("model_id")
        if not model_id:
            raise HTTPException(status_code=400, detail="Model ID not specified in proof")
        
        model = model_manager.get_model(model_id)
        if model is None:
            raise HTTPException(status_code=404, detail="Model not found")
        
        # Create ProofOfAI instance
        proof_of_ai = ProofOfAI(model_path=model["file_path"])
        
        # Verify proof
        is_valid = proof_of_ai.verify_proof(block_data.dict(), proof)
        
        return {"is_valid": is_valid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Run the API server
def start_server(host="0.0.0.0", port=8000):
    """Start the API server."""
    uvicorn.run("hypernova_ai.api:app", host=host, port=port, reload=True)

if __name__ == "__main__":
    start_server()
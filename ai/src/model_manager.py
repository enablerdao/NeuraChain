import os
import json
import hashlib
import time
import shutil
from typing import Dict, List, Optional, Union, Any
import numpy as np
import tensorflow as tf
import torch

class ModelManager:
    """
    AI model manager for HyperNova Chain.
    
    This class manages AI models used in the HyperNova Chain ecosystem,
    including model storage, retrieval, and metadata management.
    """
    
    def __init__(self, models_dir: str):
        """
        Initialize the model manager.
        
        Args:
            models_dir: Directory to store models
        """
        self.models_dir = models_dir
        self.models_metadata = {}
        self._load_metadata()
        
    def _load_metadata(self):
        """Load metadata for all models in the models directory."""
        metadata_path = os.path.join(self.models_dir, "metadata.json")
        
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, "r") as f:
                    self.models_metadata = json.load(f)
            except Exception as e:
                print(f"Error loading model metadata: {e}")
                self.models_metadata = {}
        else:
            self.models_metadata = {}
    
    def _save_metadata(self):
        """Save metadata for all models."""
        metadata_path = os.path.join(self.models_dir, "metadata.json")
        
        try:
            with open(metadata_path, "w") as f:
                json.dump(self.models_metadata, f, indent=2)
        except Exception as e:
            print(f"Error saving model metadata: {e}")
    
    def register_model(self, 
                       model_path: str, 
                       name: str, 
                       description: str, 
                       owner: str,
                       model_type: str,
                       tags: List[str] = None) -> str:
        """
        Register a new AI model.
        
        Args:
            model_path: Path to the model file
            name: Model name
            description: Model description
            owner: Owner's blockchain address
            model_type: Model type (e.g., "tensorflow", "pytorch")
            tags: List of tags
            
        Returns:
            Model ID
        """
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        # Generate a unique model ID
        model_id = self._generate_model_id(model_path, owner)
        
        # Create model directory
        model_dir = os.path.join(self.models_dir, model_id)
        os.makedirs(model_dir, exist_ok=True)
        
        # Copy the model file
        dest_path = os.path.join(model_dir, os.path.basename(model_path))
        shutil.copy2(model_path, dest_path)
        
        # Create metadata
        metadata = {
            "id": model_id,
            "name": name,
            "description": description,
            "owner": owner,
            "model_type": model_type,
            "tags": tags or [],
            "created_at": int(time.time()),
            "file_path": dest_path,
            "size_bytes": os.path.getsize(dest_path),
            "hash": self._compute_file_hash(dest_path),
        }
        
        # Save metadata
        self.models_metadata[model_id] = metadata
        self._save_metadata()
        
        return model_id
    
    def get_model(self, model_id: str) -> Optional[Dict]:
        """
        Get model metadata.
        
        Args:
            model_id: Model ID
            
        Returns:
            Model metadata or None if not found
        """
        return self.models_metadata.get(model_id)
    
    def load_model(self, model_id: str) -> Any:
        """
        Load an AI model.
        
        Args:
            model_id: Model ID
            
        Returns:
            Loaded model
        """
        metadata = self.get_model(model_id)
        
        if metadata is None:
            raise ValueError(f"Model not found: {model_id}")
        
        model_path = metadata["file_path"]
        model_type = metadata["model_type"]
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        if model_type == "tensorflow":
            return tf.keras.models.load_model(model_path)
        elif model_type == "pytorch":
            return torch.load(model_path)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
    
    def list_models(self, owner: Optional[str] = None, tags: Optional[List[str]] = None) -> List[Dict]:
        """
        List available models.
        
        Args:
            owner: Filter by owner
            tags: Filter by tags
            
        Returns:
            List of model metadata
        """
        models = list(self.models_metadata.values())
        
        # Filter by owner
        if owner is not None:
            models = [m for m in models if m["owner"] == owner]
        
        # Filter by tags
        if tags is not None:
            models = [m for m in models if all(tag in m["tags"] for tag in tags)]
        
        return models
    
    def delete_model(self, model_id: str, owner: str) -> bool:
        """
        Delete a model.
        
        Args:
            model_id: Model ID
            owner: Owner's blockchain address
            
        Returns:
            True if deleted, False otherwise
        """
        metadata = self.get_model(model_id)
        
        if metadata is None:
            return False
        
        if metadata["owner"] != owner:
            return False
        
        # Delete model files
        model_dir = os.path.join(self.models_dir, model_id)
        if os.path.exists(model_dir):
            shutil.rmtree(model_dir)
        
        # Remove metadata
        del self.models_metadata[model_id]
        self._save_metadata()
        
        return True
    
    def update_model_metadata(self, 
                             model_id: str, 
                             owner: str, 
                             updates: Dict) -> bool:
        """
        Update model metadata.
        
        Args:
            model_id: Model ID
            owner: Owner's blockchain address
            updates: Metadata updates
            
        Returns:
            True if updated, False otherwise
        """
        metadata = self.get_model(model_id)
        
        if metadata is None:
            return False
        
        if metadata["owner"] != owner:
            return False
        
        # Update allowed fields
        allowed_fields = ["name", "description", "tags"]
        for field in allowed_fields:
            if field in updates:
                metadata[field] = updates[field]
        
        # Save metadata
        self._save_metadata()
        
        return True
    
    def _generate_model_id(self, model_path: str, owner: str) -> str:
        """
        Generate a unique model ID.
        
        Args:
            model_path: Path to the model file
            owner: Owner's blockchain address
            
        Returns:
            Model ID
        """
        # Compute hash of the model file
        file_hash = self._compute_file_hash(model_path)
        
        # Combine with owner and timestamp
        combined = f"{file_hash}:{owner}:{int(time.time())}"
        
        # Generate final ID
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def _compute_file_hash(self, file_path: str) -> str:
        """
        Compute the hash of a file.
        
        Args:
            file_path: Path to the file
            
        Returns:
            File hash
        """
        hasher = hashlib.sha256()
        
        with open(file_path, "rb") as f:
            # Read in chunks to handle large files
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        
        return hasher.hexdigest()


class ModelInference:
    """
    AI model inference for HyperNova Chain.
    
    This class provides inference capabilities for AI models in the
    HyperNova Chain ecosystem.
    """
    
    def __init__(self, model_manager: ModelManager):
        """
        Initialize the model inference.
        
        Args:
            model_manager: ModelManager instance
        """
        self.model_manager = model_manager
        self.loaded_models = {}
    
    def predict(self, 
                model_id: str, 
                input_data: Union[np.ndarray, Dict, List],
                user_address: Optional[str] = None) -> Dict:
        """
        Make predictions using an AI model.
        
        Args:
            model_id: Model ID
            input_data: Input data for the model
            user_address: User's blockchain address (for access control)
            
        Returns:
            Prediction results
        """
        # Get model metadata
        metadata = self.model_manager.get_model(model_id)
        
        if metadata is None:
            raise ValueError(f"Model not found: {model_id}")
        
        # In a real implementation, this would check if the user has access to the model
        # For now, we'll skip access control
        
        # Load the model if not already loaded
        if model_id not in self.loaded_models:
            self.loaded_models[model_id] = self.model_manager.load_model(model_id)
        
        model = self.loaded_models[model_id]
        model_type = metadata["model_type"]
        
        # Prepare input data
        prepared_input = self._prepare_input(input_data, model_type)
        
        # Run inference
        start_time = time.time()
        
        if model_type == "tensorflow":
            predictions = model.predict(prepared_input)
        elif model_type == "pytorch":
            with torch.no_grad():
                if isinstance(prepared_input, np.ndarray):
                    tensor_input = torch.from_numpy(prepared_input)
                else:
                    tensor_input = prepared_input
                predictions = model(tensor_input)
                if isinstance(predictions, torch.Tensor):
                    predictions = predictions.numpy()
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        inference_time = time.time() - start_time
        
        # Format results
        results = {
            "model_id": model_id,
            "predictions": self._format_predictions(predictions),
            "inference_time": inference_time,
            "timestamp": int(time.time()),
        }
        
        return results
    
    def _prepare_input(self, 
                      input_data: Union[np.ndarray, Dict, List], 
                      model_type: str) -> Union[np.ndarray, torch.Tensor]:
        """
        Prepare input data for the model.
        
        Args:
            input_data: Input data
            model_type: Model type
            
        Returns:
            Prepared input data
        """
        if isinstance(input_data, np.ndarray):
            return input_data
        
        if isinstance(input_data, (dict, list)):
            # Convert to numpy array
            if model_type == "tensorflow":
                return np.array(input_data)
            elif model_type == "pytorch":
                return torch.tensor(input_data)
        
        raise ValueError(f"Unsupported input data type: {type(input_data)}")
    
    def _format_predictions(self, predictions: Union[np.ndarray, List]) -> List:
        """
        Format prediction results.
        
        Args:
            predictions: Raw predictions
            
        Returns:
            Formatted predictions
        """
        if isinstance(predictions, np.ndarray):
            # Convert numpy array to list
            if predictions.ndim == 1:
                return predictions.tolist()
            else:
                return [row.tolist() for row in predictions]
        
        return predictions
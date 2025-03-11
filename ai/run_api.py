import os
import sys
import uvicorn
from src.api import app

def main():
    # Get port from environment or use default
    port = int(os.environ.get("PORT", 8000))
    
    # Get host from environment or use default
    host = os.environ.get("HOST", "0.0.0.0")
    
    # Run the API server
    print(f"Starting HyperNova Chain AI API on {host}:{port}")
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    main()
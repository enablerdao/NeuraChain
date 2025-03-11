# HyperNova Chain API Reference

This document provides a reference for the HyperNova Chain API.

## Core Blockchain API

The core blockchain API is accessible via JSON-RPC at `http://localhost:8545`.

### Network

#### `hnc_getNetworkInfo`

Get information about the network.

**Parameters**: None

**Returns**:
```json
{
  "name": "HyperNova Testnet",
  "networkId": "539",
  "chainId": "0x539",
  "protocolVersion": "1.0.0",
  "blockHeight": 1000000,
  "consensusMechanism": "Proof of AI + DPoS",
  "peerCount": 42,
  "isSyncing": false
}
```

### Blocks

#### `hnc_getLatestBlock`

Get the latest block.

**Parameters**: None

**Returns**:
```json
{
  "header": {
    "version": 1,
    "prevHash": "0x1234...",
    "merkleRoot": "0x5678...",
    "timestamp": 1625097600,
    "height": 1000000,
    "difficulty": 12345,
    "nonce": 67890,
    "shardId": 0
  },
  "hash": "0xabcd...",
  "transactions": ["0x1234...", "0x5678..."],
  "validatorSignature": "0x9012...",
  "aiProof": {
    "nonce": 12345,
    "hash": "0xefgh...",
    "confidence": 0.95,
    "timestamp": 1625097600,
    "model_id": "model1"
  }
}
```

#### `hnc_getBlockByHash`

Get a block by hash.

**Parameters**:
1. `hash`: Block hash

**Returns**: Same as `hnc_getLatestBlock`

#### `hnc_getBlockByHeight`

Get a block by height.

**Parameters**:
1. `height`: Block height

**Returns**: Same as `hnc_getLatestBlock`

### Transactions

#### `hnc_getTransactionByHash`

Get a transaction by hash.

**Parameters**:
1. `hash`: Transaction hash

**Returns**:
```json
{
  "type": "transfer",
  "from": "0x1234...",
  "to": "0x5678...",
  "amount": "1000000000000000000",
  "data": "0x",
  "fee": "1000000000",
  "nonce": 42,
  "timestamp": 1625097600,
  "signature": "0x9012...",
  "quantumSignature": "0xabcd..."
}
```

#### `hnc_getTransactionReceipt`

Get a transaction receipt.

**Parameters**:
1. `hash`: Transaction hash

**Returns**:
```json
{
  "transactionHash": "0x1234...",
  "blockHash": "0x5678...",
  "blockHeight": 1000000,
  "transactionIndex": 0,
  "from": "0x1234...",
  "to": "0x5678...",
  "contractAddress": null,
  "gasUsed": "21000",
  "status": 1,
  "logs": [],
  "confirmations": 10
}
```

#### `hnc_sendRawTransaction`

Send a signed transaction.

**Parameters**:
1. `signedTransaction`: Signed transaction data

**Returns**:
```json
"0x1234..." // Transaction hash
```

### Accounts

#### `hnc_getAccount`

Get account information.

**Parameters**:
1. `address`: Account address

**Returns**:
```json
{
  "address": "0x1234...",
  "balance": "1000000000000000000",
  "nonce": 42,
  "isContract": false,
  "code": null,
  "storage": null
}
```

### Smart Contracts

#### `hnc_call`

Call a contract method (read-only).

**Parameters**:
1. `transaction`: Transaction object
2. `blockNumber`: Block number or tag (e.g., "latest")

**Returns**:
```json
"0x1234..." // Return data
```

#### `hnc_estimateGas`

Estimate gas for a transaction.

**Parameters**:
1. `transaction`: Transaction object

**Returns**:
```json
"21000" // Estimated gas
```

#### `hnc_getLogs`

Get contract logs.

**Parameters**:
1. `filter`: Log filter object

**Returns**:
```json
[
  {
    "address": "0x1234...",
    "topics": ["0x5678..."],
    "data": "0x9012...",
    "blockHash": "0xabcd...",
    "blockNumber": 1000000,
    "transactionHash": "0xefgh...",
    "transactionIndex": 0,
    "logIndex": 0
  }
]
```

## AI API

The AI API is accessible via REST at `http://localhost:8000`.

### Models

#### `GET /models/list`

List available AI models.

**Parameters**:
- `owner` (optional): Filter by owner
- `tag` (optional): Filter by tag

**Returns**:
```json
{
  "models": [
    {
      "id": "model1",
      "name": "HyperNova Consensus Model",
      "description": "Primary consensus model for the HyperNova Chain",
      "owner": "0x1234...",
      "model_type": "tensorflow",
      "tags": ["consensus", "security"],
      "created_at": 1625097600,
      "file_path": "models/model1.h5",
      "size_bytes": 1000000,
      "hash": "0x1234..."
    }
  ]
}
```

#### `GET /models/{model_id}`

Get model details.

**Parameters**:
- `model_id`: Model ID

**Returns**:
```json
{
  "id": "model1",
  "name": "HyperNova Consensus Model",
  "description": "Primary consensus model for the HyperNova Chain",
  "owner": "0x1234...",
  "model_type": "tensorflow",
  "tags": ["consensus", "security"],
  "created_at": 1625097600,
  "file_path": "models/model1.h5",
  "size_bytes": 1000000,
  "hash": "0x1234..."
}
```

#### `POST /models/register`

Register a new AI model.

**Parameters**:
- `file`: Model file
- `name`: Model name
- `description`: Model description
- `owner`: Owner address
- `model_type`: Model type
- `tags`: JSON array of tags

**Returns**:
```json
{
  "model_id": "model1"
}
```

#### `DELETE /models/{model_id}`

Delete a model.

**Parameters**:
- `model_id`: Model ID
- `owner`: Owner address

**Returns**:
```json
{
  "success": true
}
```

#### `POST /models/predict`

Make predictions using a model.

**Parameters**:
```json
{
  "model_id": "model1",
  "input_data": [[1, 2, 3, 4, 5]],
  "user_address": "0x1234..."
}
```

**Returns**:
```json
{
  "model_id": "model1",
  "predictions": [[0.1, 0.2, 0.7]],
  "inference_time": 0.05,
  "timestamp": 1625097600
}
```

### Consensus

#### `POST /consensus/generate_proof`

Generate an AI proof for a block.

**Parameters**:
```json
{
  "block_data": {
    "height": 1000000,
    "prev_hash": "0x1234...",
    "timestamp": 1625097600,
    "transactions": []
  },
  "model_id": "model1"
}
```

**Returns**:
```json
{
  "nonce": 12345,
  "hash": "0x1234...",
  "confidence": 0.95,
  "timestamp": 1625097600,
  "model_id": "model1",
  "is_valid": true
}
```

#### `POST /consensus/verify_proof`

Verify an AI proof for a block.

**Parameters**:
```json
{
  "block_data": {
    "height": 1000000,
    "prev_hash": "0x1234...",
    "timestamp": 1625097600,
    "transactions": []
  },
  "proof": {
    "nonce": 12345,
    "hash": "0x1234...",
    "confidence": 0.95,
    "timestamp": 1625097600,
    "model_id": "model1"
  }
}
```

**Returns**:
```json
{
  "is_valid": true
}
```
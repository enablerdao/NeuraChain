# HyperNova Chain SDK

A JavaScript/TypeScript SDK for interacting with the HyperNova Chain blockchain.

## Installation

```bash
npm install hypernova-sdk
```

## Usage

### Initializing the Client

```typescript
import { HyperNovaClient } from 'hypernova-sdk';

// Create a client without a wallet (read-only)
const client = new HyperNovaClient({
  nodeUrl: 'http://localhost:8545',
  aiApiUrl: 'http://localhost:8000'
});

// Create a client with a wallet
const clientWithWallet = new HyperNovaClient({
  nodeUrl: 'http://localhost:8545',
  aiApiUrl: 'http://localhost:8000',
  privateKey: '0x1234...' // Your private key
});
```

### Getting Network Information

```typescript
// Get network information
const networkInfo = await client.getNetworkInfo();
console.log('Network:', networkInfo.name);
console.log('Chain ID:', networkInfo.chainId);
console.log('Block Height:', networkInfo.blockHeight);
```

### Working with Blocks

```typescript
// Get the latest block
const latestBlock = await client.getLatestBlock();
console.log('Latest Block:', latestBlock.header.height);

// Get a block by hash
const block = await client.getBlockByHash('0x1234...');

// Get a block by height
const block = await client.getBlockByHeight(1000);
```

### Working with Transactions

```typescript
// Create a transaction
const tx = client.createTransaction(
  '0x5678...', // recipient
  '1.5', // amount
  '0x' // data (optional)
);

// Send a transaction
const txHash = await client.sendTransaction(tx);
console.log('Transaction Hash:', txHash);

// Get a transaction
const tx = await client.getTransaction('0x1234...');

// Get a transaction receipt
const receipt = await client.getTransactionReceipt('0x1234...');

// Wait for a transaction to be confirmed
const receipt = await client.waitForTransaction('0x1234...', 3); // Wait for 3 confirmations
```

### Working with Smart Contracts

```typescript
// Get a contract instance
const abi = [...]; // Contract ABI
const contract = client.getContract('0x1234...', abi);

// Call a read-only method
const result = await contract.call('balanceOf', '0x5678...');

// Send a transaction to a contract method
const txHash = await contract.send('transfer', ['0x5678...', '100'], '0');

// Estimate gas for a contract method
const gas = await contract.estimateGas('transfer', ['0x5678...', '100'], '0');

// Get contract events
const events = await contract.getEvents('Transfer', {}, 0, 'latest');
```

### Working with AI Models

```typescript
// List available AI models
const models = await client.ai.listModels();

// Get model details
const model = await client.ai.getModel('model1');

// Register a new AI model
const modelId = await client.ai.registerModel(
  file, // File object
  {
    name: 'My Model',
    description: 'A description of my model',
    owner: '0x1234...',
    model_type: 'tensorflow',
    tags: ['tag1', 'tag2']
  }
);

// Make predictions using a model
const predictions = await client.ai.predict(
  'model1',
  [[1, 2, 3, 4, 5]], // Input data
  '0x1234...' // User address (optional)
);

// Generate an AI proof for a block
const proof = await client.ai.generateProof(
  {
    height: 1000,
    prev_hash: '0x1234...',
    timestamp: 1625097600,
    transactions: []
  },
  'model1' // Model ID (optional)
);

// Verify an AI proof for a block
const isValid = await client.ai.verifyProof(
  {
    height: 1000,
    prev_hash: '0x1234...',
    timestamp: 1625097600,
    transactions: []
  },
  proof
);
```

### Wallet Operations

```typescript
// Create a new random wallet
const wallet = Wallet.createRandom();
console.log('Address:', wallet.getAddress());

// Create a wallet from a mnemonic
const wallet = Wallet.fromMnemonic('word1 word2 word3 ...');

// Sign a message
const signature = wallet.signMessage('Hello, World!');

// Sign a transaction
const signedTx = wallet.signTransaction(tx);
```

### Utility Functions

```typescript
import { 
  hexToBytes, 
  bytesToHex, 
  sha256Hash, 
  formatTimestamp, 
  formatAmount, 
  parseAmount, 
  randomNonce, 
  isValidAddress 
} from 'hypernova-sdk';

// Convert hex to bytes
const bytes = hexToBytes('0x1234...');

// Convert bytes to hex
const hex = bytesToHex(bytes);

// Calculate SHA-256 hash
const hash = sha256Hash('Hello, World!');

// Format a timestamp
const formattedDate = formatTimestamp(1625097600);

// Format an amount
const formattedAmount = formatAmount('1000000000000000000', 18); // '1.0'

// Parse an amount
const parsedAmount = parseAmount('1.0', 18); // '1000000000000000000'

// Generate a random nonce
const nonce = randomNonce();

// Check if an address is valid
const isValid = isValidAddress('0x1234...');
```

## Development

### Building the SDK

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## License

[License information]
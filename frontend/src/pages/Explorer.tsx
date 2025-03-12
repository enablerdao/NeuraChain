import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  Divider,
  Link,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  ContentCopy as ContentCopyIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNetwork } from '../contexts/NetworkContext';

// Mock data for blocks
const mockBlocks = [
  {
    height: 1000000,
    hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    timestamp: Date.now() - 5000,
    transactions: 156,
    size: 1.2,
    validator: '0xabcd...1234',
    aiConfidence: 0.95,
  },
  {
    height: 999999,
    hash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
    timestamp: Date.now() - 10000,
    transactions: 142,
    size: 1.1,
    validator: '0xefgh...5678',
    aiConfidence: 0.92,
  },
  {
    height: 999998,
    hash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
    timestamp: Date.now() - 15000,
    transactions: 189,
    size: 1.4,
    validator: '0xijkl...9012',
    aiConfidence: 0.97,
  },
  {
    height: 999997,
    hash: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w',
    timestamp: Date.now() - 20000,
    transactions: 167,
    size: 1.3,
    validator: '0xmnop...3456',
    aiConfidence: 0.94,
  },
  {
    height: 999996,
    hash: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x',
    timestamp: Date.now() - 25000,
    transactions: 201,
    size: 1.5,
    validator: '0xqrst...7890',
    aiConfidence: 0.96,
  },
];

// Mock data for transactions
const mockTransactions = [
  {
    hash: '0xabcd...1234',
    from: '0x1a2b...3c4d',
    to: '0x5e6f...7g8h',
    amount: '1,250 HNC',
    fee: '0.0025 HNC',
    timestamp: Date.now() - 2000,
    status: 'confirmed',
    type: 'transfer',
  },
  {
    hash: '0xefgh...5678',
    from: '0x9i0j...1k2l',
    to: '0x3m4n...5o6p',
    amount: '750 HNC',
    fee: '0.0022 HNC',
    timestamp: Date.now() - 5000,
    status: 'confirmed',
    type: 'transfer',
  },
  {
    hash: '0xijkl...9012',
    from: '0x7q8r...9s0t',
    to: '0x1u2v...3w4x',
    amount: '500 HNC',
    fee: '0.0020 HNC',
    timestamp: Date.now() - 8000,
    status: 'confirmed',
    type: 'transfer',
  },
  {
    hash: '0xmnop...3456',
    from: '0x5y6z...7a8b',
    to: '0x9c0d...1e2f',
    amount: '2,000 HNC',
    fee: '0.0030 HNC',
    timestamp: Date.now() - 12000,
    status: 'confirmed',
    type: 'transfer',
  },
  {
    hash: '0xqrst...7890',
    from: '0x3g4h...5i6j',
    to: null,
    amount: '0 HNC',
    fee: '0.0050 HNC',
    timestamp: Date.now() - 15000,
    status: 'confirmed',
    type: 'contract_deploy',
  },
];

// Mock data for a specific block
const mockBlockDetails = {
  height: 1000000,
  hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
  prev_hash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
  timestamp: Date.now() - 5000,
  transactions: 156,
  size: 1.2,
  validator: '0xabcd...1234',
  merkle_root: '0x6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z',
  nonce: 12345678,
  difficulty: 123456,
  total_difficulty: 98765432100,
  gas_used: 1200000,
  gas_limit: 2000000,
  extra_data: '0x48797065724e6f766120436861696e',
  sha3_uncles: '0x0000000000000000000000000000000000000000000000000000000000000000',
  state_root: '0x7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b',
  receipts_root: '0x8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c',
  shard_id: 0,
  ai_proof: {
    nonce: 87654321,
    hash: '0x9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d',
    confidence: 0.95,
    timestamp: Date.now() - 5500,
    model_id: 'model1',
  },
};

// Mock data for a specific transaction
const mockTransactionDetails = {
  hash: '0xabcd...1234',
  block_height: 1000000,
  block_hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
  from: '0x1a2b...3c4d',
  to: '0x5e6f...7g8h',
  amount: '1,250 HNC',
  fee: '0.0025 HNC',
  timestamp: Date.now() - 2000,
  status: 'confirmed',
  type: 'transfer',
  nonce: 42,
  position: 23,
  gas_price: '0.00000001 HNC',
  gas_limit: 21000,
  gas_used: 21000,
  input_data: '0x',
  logs: [],
  confirmations: 10,
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`explorer-tabpanel-${index}`}
      aria-labelledby={`explorer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Explorer: React.FC = () => {
  const { networkName, blockHeight } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [detailsType, setDetailsType] = useState<'block' | 'transaction'>('block');
  const [selectedBlock, setSelectedBlock] = useState(mockBlockDetails);
  const [selectedTransaction, setSelectedTransaction] = useState(mockTransactionDetails);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    
    // In a real implementation, this would search for blocks, transactions, addresses, etc.
    // For now, we'll just simulate viewing details
    
    if (searchQuery.startsWith('0x')) {
      // Assume it's a transaction hash
      setDetailsType('transaction');
      setSelectedTransaction(mockTransactionDetails);
      setViewMode('details');
    } else if (!isNaN(Number(searchQuery))) {
      // Assume it's a block height
      setDetailsType('block');
      setSelectedBlock(mockBlockDetails);
      setViewMode('details');
    }
  };

  const handleViewBlock = (block: any) => {
    setDetailsType('block');
    setSelectedBlock(mockBlockDetails);
    setViewMode('details');
  };

  const handleViewTransaction = (transaction: any) => {
    setDetailsType('transaction');
    setSelectedTransaction(mockTransactionDetails);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
      return `${Math.floor(diff / 1000)} seconds ago`;
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} minutes ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} hours ago`;
    } else {
      return new Date(timestamp).toLocaleString();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real implementation, you would show a notification
    console.log('Copied to clipboard:', text);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Block Explorer
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search by Block Height, Hash, Transaction Hash, or Address"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {viewMode === 'list' ? (
        <Box>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Blocks" />
              <Tab label="Transactions" />
              <Tab label="Validators" />
              <Tab label="AI Models" />
            </Tabs>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Height</TableCell>
                    <TableCell>Hash</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Txs</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Validator</TableCell>
                    <TableCell>AI Confidence</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockBlocks.map((block) => (
                    <TableRow key={block.height} hover>
                      <TableCell>{block.height.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {block.hash.slice(0, 10)}...
                          <IconButton size="small" onClick={() => copyToClipboard(block.hash)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>{formatTimestamp(block.timestamp)}</TableCell>
                      <TableCell>{block.transactions}</TableCell>
                      <TableCell>{block.size} MB</TableCell>
                      <TableCell>{block.validator}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${(block.aiConfidence * 100).toFixed(0)}%`}
                          color={block.aiConfidence > 0.9 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleViewBlock(block)}>
                          <ArrowForwardIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hash</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockTransactions.map((tx) => (
                    <TableRow key={tx.hash} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {tx.hash}
                          <IconButton size="small" onClick={() => copyToClipboard(tx.hash)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.type === 'transfer' ? 'Transfer' : 'Contract Deploy'}
                          color={tx.type === 'transfer' ? 'primary' : 'secondary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                      <TableCell>{tx.from}</TableCell>
                      <TableCell>{tx.to || 'Contract Creation'}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>{tx.fee}</TableCell>
                      <TableCell>
                        <Chip
                          label={tx.status}
                          color={tx.status === 'confirmed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleViewTransaction(tx)}>
                          <ArrowForwardIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Active Validators
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Stake</TableCell>
                    <TableCell>Blocks Produced</TableCell>
                    <TableCell>Uptime</TableCell>
                    <TableCell>AI Model</TableCell>
                    <TableCell>Avg. Confidence</TableCell>
                    <TableCell>Commission</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <TableRow key={rank} hover>
                      <TableCell>{rank}</TableCell>
                      <TableCell>{`0x${rank}a2b...3c4d`}</TableCell>
                      <TableCell>{`${(10000000 / rank).toLocaleString()} HNC`}</TableCell>
                      <TableCell>{(1000000 / rank).toLocaleString()}</TableCell>
                      <TableCell>{`${99.9 - (rank * 0.1)}%`}</TableCell>
                      <TableCell>{`HyperNova Validator v${rank}.0`}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${(98 - rank).toFixed(1)}%`}
                          color={98 - rank > 95 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{`${5 + rank}%`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Active AI Models
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Model ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Usage Count</TableCell>
                    <TableCell>Avg. Confidence</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((id) => (
                    <TableRow key={id} hover>
                      <TableCell>{`model${id}`}</TableCell>
                      <TableCell>{`HyperNova AI Model v${id}.0`}</TableCell>
                      <TableCell>{`0x${id}a2b...3c4d`}</TableCell>
                      <TableCell>{id % 2 === 0 ? 'Consensus' : 'Security'}</TableCell>
                      <TableCell>{(100000 / id).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${(98 - id).toFixed(1)}%`}
                          color={98 - id > 95 ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{`${5 - (id * 0.2).toFixed(1)}/5`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      ) : (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBackToList}
            sx={{ mb: 3 }}
          >
            Back to List
          </Button>

          {detailsType === 'block' ? (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Block #{selectedBlock.height.toLocaleString()}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Block Hash
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedBlock.hash}
                      <IconButton size="small" onClick={() => copyToClipboard(selectedBlock.hash)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Previous Block Hash
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedBlock.prev_hash}
                      <IconButton size="small" onClick={() => copyToClipboard(selectedBlock.prev_hash)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Timestamp
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedBlock.timestamp).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transactions
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.transactions}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.size} MB
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Validator
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.validator}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Merkle Root
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedBlock.merkle_root}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nonce
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.nonce}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Difficulty
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.difficulty.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Difficulty
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.total_difficulty.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gas Used
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.gas_used.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gas Limit
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.gas_limit.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Extra Data
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.extra_data}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Shard ID
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.shard_id}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      AI Proof
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      AI Model ID
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.ai_proof.model_id}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Confidence
                    </Typography>
                    <Typography variant="body1">
                      <Chip
                        label={`${(selectedBlock.ai_proof.confidence * 100).toFixed(1)}%`}
                        color={selectedBlock.ai_proof.confidence > 0.9 ? 'success' : 'warning'}
                      />
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Proof Hash
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedBlock.ai_proof.hash}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Proof Nonce
                    </Typography>
                    <Typography variant="body1">
                      {selectedBlock.ai_proof.nonce}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Transactions
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Hash</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Fee</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mockTransactions.slice(0, 3).map((tx) => (
                            <TableRow key={tx.hash} hover>
                              <TableCell>{tx.hash}</TableCell>
                              <TableCell>
                                <Chip
                                  label={tx.type === 'transfer' ? 'Transfer' : 'Contract Deploy'}
                                  color={tx.type === 'transfer' ? 'primary' : 'secondary'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{tx.from}</TableCell>
                              <TableCell>{tx.to || 'Contract Creation'}</TableCell>
                              <TableCell>{tx.amount}</TableCell>
                              <TableCell>{tx.fee}</TableCell>
                              <TableCell>
                                <IconButton size="small" onClick={() => handleViewTransaction(tx)}>
                                  <ArrowForwardIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Transaction Details
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction Hash
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedTransaction.hash}
                      <IconButton size="small" onClick={() => copyToClipboard(selectedTransaction.hash)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1">
                      <Chip
                        label={selectedTransaction.status}
                        color={selectedTransaction.status === 'confirmed' ? 'success' : 'warning'}
                      />
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1">
                      <Chip
                        label={selectedTransaction.type === 'transfer' ? 'Transfer' : 'Contract Deploy'}
                        color={selectedTransaction.type === 'transfer' ? 'primary' : 'secondary'}
                      />
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Block
                    </Typography>
                    <Typography variant="body1">
                      <Link href="#" onClick={() => handleViewBlock({ height: selectedTransaction.block_height })}>
                        {selectedTransaction.block_height.toLocaleString()}
                      </Link>
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Timestamp
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedTransaction.timestamp).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      From
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedTransaction.from}
                      <IconButton size="small" onClick={() => copyToClipboard(selectedTransaction.from)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      To
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedTransaction.to || 'Contract Creation'}
                      {selectedTransaction.to && (
                        <IconButton size="small" onClick={() => copyToClipboard(selectedTransaction.to || '')}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.amount}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Transaction Fee
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.fee}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nonce
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.nonce}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gas Price
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.gas_price}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gas Limit
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.gas_limit.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gas Used
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.gas_used.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Confirmations
                    </Typography>
                    <Typography variant="body1">
                      {selectedTransaction.confirmations}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Input Data
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'background.paper', mt: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {selectedTransaction.input_data}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Explorer;
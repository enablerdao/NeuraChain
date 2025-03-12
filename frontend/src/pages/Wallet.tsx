import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tab,
  Tabs,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Send as SendIcon,
  CallReceived as ReceiveIcon,
  ContentCopy as CopyIcon,
  QrCode as QrCodeIcon,
  SwapHoriz as SwapIcon,
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useWallet } from '../contexts/WalletContext';

// Mock transaction history
const mockTransactions = [
  {
    hash: '0xabcd...1234',
    type: 'send',
    to: '0x5e6f...7g8h',
    from: '0x1a2b...3c4d',
    amount: '50 HNC',
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    status: 'confirmed',
    fee: '0.0025 HNC',
  },
  {
    hash: '0xefgh...5678',
    type: 'receive',
    from: '0x9i0j...1k2l',
    to: '0x1a2b...3c4d',
    amount: '100 HNC',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    status: 'confirmed',
    fee: '0.0022 HNC',
  },
  {
    hash: '0xijkl...9012',
    type: 'send',
    to: '0x3m4n...5o6p',
    from: '0x1a2b...3c4d',
    amount: '25 HNC',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    status: 'confirmed',
    fee: '0.0020 HNC',
  },
  {
    hash: '0xmnop...3456',
    type: 'receive',
    from: '0x7q8r...9s0t',
    to: '0x1a2b...3c4d',
    amount: '75 HNC',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    status: 'confirmed',
    fee: '0.0018 HNC',
  },
  {
    hash: '0xqrst...7890',
    type: 'stake',
    from: '0x1a2b...3c4d',
    to: 'Staking Contract',
    amount: '500 HNC',
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    status: 'confirmed',
    fee: '0.0030 HNC',
  },
];

// Mock token balances
const mockTokens = [
  {
    symbol: 'HNC',
    name: 'HyperNova Chain',
    balance: '1,250.5',
    value: '$1,250.50',
    address: '0x0000000000000000000000000000000000000000', // Native token
    logo: '/images/hnc-logo.png',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '500.00',
    value: '$500.00',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    logo: '/images/usdc-logo.png',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '0.25',
    value: '$750.00',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    logo: '/images/eth-logo.png',
  },
  {
    symbol: 'HNAI',
    name: 'HyperNova AI Token',
    balance: '100.00',
    value: '$200.00',
    address: '0x7890abcdef1234567890abcdef1234567890abcd',
    logo: '/images/hnai-logo.png',
  },
];

// Mock staking data
const mockStaking = {
  total_staked: '500 HNC',
  rewards: '25 HNC',
  apy: '12.5%',
  unbonding_period: '14 days',
  validators: [
    {
      name: 'Validator 1',
      address: '0x1234...5678',
      staked: '300 HNC',
      rewards: '15 HNC',
      commission: '5%',
    },
    {
      name: 'Validator 2',
      address: '0xabcd...efgh',
      staked: '200 HNC',
      rewards: '10 HNC',
      commission: '7%',
    },
  ],
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
      id={`wallet-tabpanel-${index}`}
      aria-labelledby={`wallet-tab-${index}`}
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

const Wallet: React.FC = () => {
  const { connected, address, balance, connect } = useWallet();
  const [tabValue, setTabValue] = useState(0);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false);
  const [importTokenDialogOpen, setImportTokenDialogOpen] = useState(false);
  
  // Send form state
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    token: 'HNC',
    memo: '',
  });
  
  // Stake form state
  const [stakeForm, setStakeForm] = useState({
    amount: '',
    validator: '',
  });
  
  // Unstake form state
  const [unstakeForm, setUnstakeForm] = useState({
    amount: '',
    validator: '',
  });
  
  // Import token form state
  const [importTokenForm, setImportTokenForm] = useState({
    address: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenSendDialog = () => {
    setSendDialogOpen(true);
  };

  const handleCloseSendDialog = () => {
    setSendDialogOpen(false);
  };

  const handleOpenReceiveDialog = () => {
    setReceiveDialogOpen(true);
  };

  const handleCloseReceiveDialog = () => {
    setReceiveDialogOpen(false);
  };

  const handleOpenStakeDialog = () => {
    setStakeDialogOpen(true);
  };

  const handleCloseStakeDialog = () => {
    setStakeDialogOpen(false);
  };

  const handleOpenUnstakeDialog = () => {
    setUnstakeDialogOpen(true);
  };

  const handleCloseUnstakeDialog = () => {
    setUnstakeDialogOpen(false);
  };

  const handleOpenImportTokenDialog = () => {
    setImportTokenDialogOpen(true);
  };

  const handleCloseImportTokenDialog = () => {
    setImportTokenDialogOpen(false);
  };

  const handleSendFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSendForm({ ...sendForm, [name]: value });
  };

  const handleTokenChange = (e: any) => {
    setSendForm({ ...sendForm, token: e.target.value });
  };

  const handleStakeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStakeForm({ ...stakeForm, [name]: value });
  };

  const handleValidatorChange = (e: any) => {
    setStakeForm({ ...stakeForm, validator: e.target.value });
  };

  const handleUnstakeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnstakeForm({ ...unstakeForm, [name]: value });
  };

  const handleUnstakeValidatorChange = (e: any) => {
    setUnstakeForm({ ...unstakeForm, validator: e.target.value });
  };

  const handleImportTokenFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImportTokenForm({ ...importTokenForm, [name]: value });
  };

  const handleSend = () => {
    // In a real implementation, this would send a transaction
    console.log('Sending transaction:', sendForm);
    handleCloseSendDialog();
    
    // Reset form
    setSendForm({
      recipient: '',
      amount: '',
      token: 'HNC',
      memo: '',
    });
  };

  const handleStake = () => {
    // In a real implementation, this would stake tokens
    console.log('Staking tokens:', stakeForm);
    handleCloseStakeDialog();
    
    // Reset form
    setStakeForm({
      amount: '',
      validator: '',
    });
  };

  const handleUnstake = () => {
    // In a real implementation, this would unstake tokens
    console.log('Unstaking tokens:', unstakeForm);
    handleCloseUnstakeDialog();
    
    // Reset form
    setUnstakeForm({
      amount: '',
      validator: '',
    });
  };

  const handleImportToken = () => {
    // In a real implementation, this would import a token
    console.log('Importing token:', importTokenForm);
    handleCloseImportTokenDialog();
    
    // Reset form
    setImportTokenForm({
      address: '',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real implementation, you would show a notification
    console.log('Copied to clipboard:', text);
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
      return new Date(timestamp).toLocaleDateString();
    }
  };

  if (!connected) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <WalletIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Connect your wallet to view your balance, send transactions, and stake tokens.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={connect}
          sx={{ mt: 2 }}
        >
          Connect Wallet
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Wallet
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {address}
                </Typography>
                <IconButton size="small" onClick={() => copyToClipboard(address)}>
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h5" gutterBottom>
                {mockTokens[0].balance} HNC
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {mockTokens[0].value} USD
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SendIcon />}
                  onClick={handleOpenSendDialog}
                  fullWidth
                >
                  Send
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ReceiveIcon />}
                  onClick={handleOpenReceiveDialog}
                  fullWidth
                >
                  Receive
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Tokens" />
                <Tab label="Transactions" />
                <Tab label="Staking" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Your Tokens
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleOpenImportTokenDialog}
                >
                  Import Token
                </Button>
              </Box>
              
              <List>
                {mockTokens.map((token) => (
                  <Paper key={token.symbol} sx={{ mb: 2 }}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" onClick={handleOpenSendDialog}>
                          <SendIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Box
                          component="img"
                          src={token.logo}
                          alt={token.symbol}
                          sx={{ width: 32, height: 32 }}
                          onError={(e: any) => {
                            e.target.src = 'https://via.placeholder.com/32';
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" component="span">
                              {token.name}
                            </Typography>
                            <Chip
                              label={token.symbol}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="body2" component="span">
                              {token.balance}
                            </Typography>
                            <Typography variant="body2" component="span" color="text.secondary">
                              {token.value}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Transaction History
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                >
                  Refresh
                </Button>
              </Box>
              
              <List>
                {mockTransactions.map((tx) => (
                  <Paper key={tx.hash} sx={{ mb: 2 }}>
                    <ListItem>
                      <ListItemIcon>
                        {tx.type === 'send' ? (
                          <ArrowUpwardIcon color="error" />
                        ) : tx.type === 'receive' ? (
                          <ArrowDownwardIcon color="success" />
                        ) : (
                          <SwapIcon color="primary" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" component="span">
                              {tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : 'Staked'}
                            </Typography>
                            <Chip
                              label={tx.status}
                              size="small"
                              color={tx.status === 'confirmed' ? 'success' : 'warning'}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" component="span" color="text.secondary">
                              {tx.type === 'send' ? `To: ${tx.to}` : `From: ${tx.from}`}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography variant="body2" component="span" color={tx.type === 'send' ? 'error.main' : 'success.main'}>
                                {tx.type === 'send' ? '-' : '+'}{tx.amount}
                              </Typography>
                              <Typography variant="caption" component="span" color="text.secondary">
                                {formatTimestamp(tx.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Staking
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleOpenStakeDialog}
                    sx={{ mr: 1 }}
                  >
                    Stake
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<RemoveIcon />}
                    onClick={handleOpenUnstakeDialog}
                  >
                    Unstake
                  </Button>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Total Staked
                    </Typography>
                    <Typography variant="h5">
                      {mockStaking.total_staked}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Rewards
                    </Typography>
                    <Typography variant="h5">
                      {mockStaking.rewards}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Claim Rewards
                    </Button>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      APY
                    </Typography>
                    <Typography variant="h5">
                      {mockStaking.apy}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Unbonding Period
                    </Typography>
                    <Typography variant="h5">
                      {mockStaking.unbonding_period}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Your Validators
                  </Typography>
                  
                  <List>
                    {mockStaking.validators.map((validator) => (
                      <Paper key={validator.address} sx={{ mb: 2 }}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" component="span">
                                  {validator.name}
                                </Typography>
                                <Typography variant="caption" component="span" color="text.secondary" sx={{ ml: 1 }}>
                                  {validator.address}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="body2" component="span">
                                  Staked: {validator.staked}
                                </Typography>
                                <Typography variant="body2" component="span">
                                  Rewards: {validator.rewards}
                                </Typography>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  Commission: {validator.commission}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Send Dialog */}
      <Dialog open={sendDialogOpen} onClose={handleCloseSendDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Send Tokens</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Token</InputLabel>
            <Select
              value={sendForm.token}
              label="Token"
              onChange={handleTokenChange}
            >
              {mockTokens.map((token) => (
                <MenuItem key={token.symbol} value={token.symbol}>
                  {token.symbol} - {token.balance}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            name="recipient"
            label="Recipient Address"
            fullWidth
            variant="outlined"
            value={sendForm.recipient}
            onChange={handleSendFormChange}
          />
          
          <TextField
            margin="normal"
            name="amount"
            label="Amount"
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">{sendForm.token}</InputAdornment>,
            }}
            value={sendForm.amount}
            onChange={handleSendFormChange}
          />
          
          <TextField
            margin="normal"
            name="memo"
            label="Memo (Optional)"
            fullWidth
            variant="outlined"
            value={sendForm.memo}
            onChange={handleSendFormChange}
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Transaction Fee: 0.0025 HNC
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimated confirmation time: &lt; 5 seconds
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendDialog}>Cancel</Button>
          <Button
            onClick={handleSend}
            variant="contained"
            color="primary"
            disabled={!sendForm.recipient || !sendForm.amount}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={receiveDialogOpen} onClose={handleCloseReceiveDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Receive Tokens</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Paper sx={{ p: 3, mb: 2, display: 'inline-block' }}>
              <QrCodeIcon sx={{ fontSize: 150, color: 'primary.main' }} />
            </Paper>
            
            <Typography variant="subtitle1" gutterBottom>
              Your Address
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                {address}
              </Typography>
              <IconButton size="small" onClick={() => copyToClipboard(address)}>
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Send only HyperNova Chain (HNC) and supported tokens to this address.
              Sending other tokens may result in permanent loss.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceiveDialog}>Close</Button>
          <Button
            onClick={() => copyToClipboard(address)}
            variant="contained"
            color="primary"
            startIcon={<CopyIcon />}
          >
            Copy Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stake Dialog */}
      <Dialog open={stakeDialogOpen} onClose={handleCloseStakeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Stake Tokens</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Stake your HNC tokens to earn rewards and participate in network security.
            Staked tokens have a {mockStaking.unbonding_period} unbonding period.
          </Typography>
          
          <TextField
            margin="normal"
            name="amount"
            label="Amount"
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">HNC</InputAdornment>,
            }}
            value={stakeForm.amount}
            onChange={handleStakeFormChange}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Validator</InputLabel>
            <Select
              value={stakeForm.validator}
              label="Validator"
              onChange={handleValidatorChange}
            >
              {mockStaking.validators.map((validator) => (
                <MenuItem key={validator.address} value={validator.address}>
                  {validator.name} - Commission: {validator.commission}
                </MenuItem>
              ))}
              <MenuItem value="new">+ Add New Validator</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Expected Annual Rewards: {mockStaking.apy}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transaction Fee: 0.0030 HNC
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStakeDialog}>Cancel</Button>
          <Button
            onClick={handleStake}
            variant="contained"
            color="primary"
            disabled={!stakeForm.amount || !stakeForm.validator}
          >
            Stake
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unstake Dialog */}
      <Dialog open={unstakeDialogOpen} onClose={handleCloseUnstakeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Unstake Tokens</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Unstaked tokens will be subject to a {mockStaking.unbonding_period} unbonding period
            before they are available in your wallet.
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Validator</InputLabel>
            <Select
              value={unstakeForm.validator}
              label="Validator"
              onChange={handleUnstakeValidatorChange}
            >
              {mockStaking.validators.map((validator) => (
                <MenuItem key={validator.address} value={validator.address}>
                  {validator.name} - Staked: {validator.staked}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            name="amount"
            label="Amount"
            fullWidth
            variant="outlined"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">HNC</InputAdornment>,
            }}
            value={unstakeForm.amount}
            onChange={handleUnstakeFormChange}
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Unbonding Period: {mockStaking.unbonding_period}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transaction Fee: 0.0030 HNC
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnstakeDialog}>Cancel</Button>
          <Button
            onClick={handleUnstake}
            variant="contained"
            color="primary"
            disabled={!unstakeForm.amount || !unstakeForm.validator}
          >
            Unstake
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Token Dialog */}
      <Dialog open={importTokenDialogOpen} onClose={handleCloseImportTokenDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Import Token</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Import a token by entering its contract address.
          </Typography>
          
          <TextField
            margin="normal"
            name="address"
            label="Token Contract Address"
            fullWidth
            variant="outlined"
            value={importTokenForm.address}
            onChange={handleImportTokenFormChange}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            {importTokenForm.address && (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            )}
            <Typography variant="body2" color="text.secondary">
              {importTokenForm.address
                ? 'Searching for token...'
                : 'Enter a token contract address to import'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportTokenDialog}>Cancel</Button>
          <Button
            onClick={handleImportToken}
            variant="contained"
            color="primary"
            disabled={!importTokenForm.address}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wallet;
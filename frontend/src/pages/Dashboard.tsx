import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
} from '@mui/material';
import { useNetwork } from '../contexts/NetworkContext';

const Dashboard: React.FC = () => {
  const { networkName, blockHeight, isConnected } = useNetwork();

  // Simulated data
  const networkStats = {
    tps: 8750,
    activeValidators: 42,
    totalStaked: '425,000,000 HNC',
    totalTransactions: '12,345,678',
  };

  const recentBlocks = [
    { height: blockHeight, transactions: 156, timestamp: new Date().toISOString(), validator: '0x1a2b...3c4d' },
    { height: blockHeight - 1, transactions: 142, timestamp: new Date(Date.now() - 5000).toISOString(), validator: '0x5e6f...7g8h' },
    { height: blockHeight - 2, transactions: 189, timestamp: new Date(Date.now() - 10000).toISOString(), validator: '0x9i0j...1k2l' },
    { height: blockHeight - 3, transactions: 167, timestamp: new Date(Date.now() - 15000).toISOString(), validator: '0x3m4n...5o6p' },
  ];

  const recentTransactions = [
    { hash: '0xabcd...1234', from: '0x1a2b...3c4d', to: '0x5e6f...7g8h', amount: '1,250 HNC', timestamp: new Date().toISOString() },
    { hash: '0xefgh...5678', from: '0x9i0j...1k2l', to: '0x3m4n...5o6p', amount: '750 HNC', timestamp: new Date(Date.now() - 30000).toISOString() },
    { hash: '0xijkl...9012', from: '0x7q8r...9s0t', to: '0x1u2v...3w4x', amount: '500 HNC', timestamp: new Date(Date.now() - 60000).toISOString() },
    { hash: '0xmnop...3456', from: '0x5y6z...7a8b', to: '0x9c0d...1e2f', amount: '2,000 HNC', timestamp: new Date(Date.now() - 90000).toISOString() },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Network Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Network Statistics" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Network
                  </Typography>
                  <Typography variant="h6">
                    {networkName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Block
                  </Typography>
                  <Typography variant="h6">
                    {blockHeight.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transactions Per Second
                  </Typography>
                  <Typography variant="h6">
                    {networkStats.tps.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Active Validators
                  </Typography>
                  <Typography variant="h6">
                    {networkStats.activeValidators}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Staked
                  </Typography>
                  <Typography variant="h6">
                    {networkStats.totalStaked}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Transactions
                  </Typography>
                  <Typography variant="h6">
                    {networkStats.totalTransactions}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Consensus Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="AI Consensus Status" />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current AI Model
                </Typography>
                <Typography variant="body1">
                  HyperNova Consensus Model v1.2.3
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last updated: 2 hours ago
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  AI Confidence Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={92} color="success" sx={{ height: 10, borderRadius: 5 }} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">92%</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Quantum Resistance Status
                </Typography>
                <Chip label="Active" color="success" size="small" />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Sharding Status
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.dark' }}>
                      <Typography variant="caption">Shard 0</Typography>
                      <Typography variant="body2">Active</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.dark' }}>
                      <Typography variant="caption">Shard 1</Typography>
                      <Typography variant="body2">Active</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.dark' }}>
                      <Typography variant="caption">Shard 2</Typography>
                      <Typography variant="body2">Active</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.dark' }}>
                      <Typography variant="caption">Shard 3</Typography>
                      <Typography variant="body2">Active</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Blocks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Blocks" />
            <Divider />
            <List>
              {recentBlocks.map((block) => (
                <React.Fragment key={block.height}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          Block #{block.height.toLocaleString()}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" component="span" color="text.secondary">
                            Transactions: {block.transactions} | Validator: {block.validator}
                          </Typography>
                          <br />
                          <Typography variant="caption" component="span" color="text.secondary">
                            {new Date(block.timestamp).toLocaleTimeString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Transactions" />
            <Divider />
            <List>
              {recentTransactions.map((tx) => (
                <React.Fragment key={tx.hash}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap>
                          {tx.hash}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" component="span" color="text.secondary">
                            From: {tx.from} | To: {tx.to}
                          </Typography>
                          <br />
                          <Typography variant="caption" component="span" color="text.secondary">
                            Amount: {tx.amount} | {new Date(tx.timestamp).toLocaleTimeString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
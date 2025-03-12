import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stack,
} from '@mui/material';
import { useWallet } from '../contexts/WalletContext';

// Mock proposals data
const mockProposals = [
  {
    id: 'prop1',
    title: 'Increase Block Size to 2MB',
    description: 'This proposal suggests increasing the block size from 1MB to 2MB to improve transaction throughput.',
    proposer: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    status: 'active',
    start_time: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    end_time: Date.now() + 4 * 24 * 60 * 60 * 1000, // 4 days from now
    for_votes: 3500000,
    against_votes: 1500000,
    total_eligible_votes: 10000000,
    quorum: 2000000,
    category: 'parameter_change',
    ai_analysis: {
      recommendation: 'for',
      confidence: 0.85,
      impact: 'high',
      risk: 'medium',
    },
  },
  {
    id: 'prop2',
    title: 'Add New Validator Rewards Structure',
    description: 'This proposal introduces a new reward structure for validators based on their AI model performance and uptime.',
    proposer: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
    status: 'active',
    start_time: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    end_time: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days from now
    for_votes: 4200000,
    against_votes: 800000,
    total_eligible_votes: 10000000,
    quorum: 2000000,
    category: 'reward_structure',
    ai_analysis: {
      recommendation: 'for',
      confidence: 0.92,
      impact: 'high',
      risk: 'low',
    },
  },
  {
    id: 'prop3',
    title: 'Integrate with Ethereum Layer 2',
    description: 'This proposal suggests integrating HyperNova Chain with Ethereum Layer 2 solutions for improved interoperability.',
    proposer: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
    status: 'active',
    start_time: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    end_time: Date.now() + 6 * 24 * 60 * 60 * 1000, // 6 days from now
    for_votes: 1800000,
    against_votes: 1200000,
    total_eligible_votes: 10000000,
    quorum: 2000000,
    category: 'protocol_upgrade',
    ai_analysis: {
      recommendation: 'neutral',
      confidence: 0.65,
      impact: 'high',
      risk: 'high',
    },
  },
  {
    id: 'prop4',
    title: 'Allocate 1M HNC to Developer Grants',
    description: 'This proposal suggests allocating 1 million HNC tokens from the treasury to fund developer grants and ecosystem growth.',
    proposer: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w',
    status: 'completed',
    start_time: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    end_time: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    for_votes: 5500000,
    against_votes: 1500000,
    total_eligible_votes: 10000000,
    quorum: 2000000,
    category: 'treasury',
    result: 'passed',
    ai_analysis: {
      recommendation: 'for',
      confidence: 0.88,
      impact: 'medium',
      risk: 'low',
    },
  },
  {
    id: 'prop5',
    title: 'Reduce Transaction Fees by 20%',
    description: 'This proposal suggests reducing the base transaction fees by 20% to encourage more network usage.',
    proposer: '0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x',
    status: 'completed',
    start_time: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    end_time: Date.now() - 13 * 24 * 60 * 60 * 1000, // 13 days ago
    for_votes: 3200000,
    against_votes: 4800000,
    total_eligible_votes: 10000000,
    quorum: 2000000,
    category: 'fee_structure',
    result: 'rejected',
    ai_analysis: {
      recommendation: 'against',
      confidence: 0.75,
      impact: 'medium',
      risk: 'medium',
    },
  },
];

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
      id={`governance-tabpanel-${index}`}
      aria-labelledby={`governance-tab-${index}`}
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

const Governance: React.FC = () => {
  const { connected, address } = useWallet();
  const [proposals, setProposals] = useState(mockProposals);
  const [tabValue, setTabValue] = useState(0);
  const [openProposalDialog, setOpenProposalDialog] = useState(false);
  const [openVoteDialog, setOpenVoteDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [voteAmount, setVoteAmount] = useState<number>(0);
  const [voteDirection, setVoteDirection] = useState<string>('for');
  const [filter, setFilter] = useState('all');

  // New proposal form state
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'parameter_change',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenProposalDialog = () => {
    setOpenProposalDialog(true);
  };

  const handleCloseProposalDialog = () => {
    setOpenProposalDialog(false);
  };

  const handleOpenVoteDialog = (proposal: any) => {
    setSelectedProposal(proposal);
    setOpenVoteDialog(true);
  };

  const handleCloseVoteDialog = () => {
    setOpenVoteDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProposal({ ...newProposal, [name]: value });
  };

  const handleCategoryChange = (e: any) => {
    setNewProposal({ ...newProposal, category: e.target.value });
  };

  const handleVoteDirectionChange = (e: any) => {
    setVoteDirection(e.target.value);
  };

  const handleVoteAmountChange = (event: Event, newValue: number | number[]) => {
    setVoteAmount(newValue as number);
  };

  const handleSubmitProposal = () => {
    // In a real implementation, this would submit the proposal to the blockchain
    console.log('Submitting proposal:', newProposal);
    
    // Simulate adding a new proposal
    const newProposalData = {
      id: `prop${proposals.length + 1}`,
      title: newProposal.title,
      description: newProposal.description,
      proposer: address,
      status: 'active',
      start_time: Date.now(),
      end_time: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      for_votes: 0,
      against_votes: 0,
      total_eligible_votes: 10000000,
      quorum: 2000000,
      category: newProposal.category,
      ai_analysis: {
        recommendation: Math.random() > 0.5 ? 'for' : 'against',
        confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      },
    };
    
    setProposals([...proposals, newProposalData]);
    handleCloseProposalDialog();
    
    // Reset form
    setNewProposal({
      title: '',
      description: '',
      category: 'parameter_change',
    });
  };

  const handleVote = () => {
    // In a real implementation, this would submit the vote to the blockchain
    console.log('Voting on proposal:', selectedProposal?.id);
    console.log('Vote direction:', voteDirection);
    console.log('Vote amount:', voteAmount);
    
    // Simulate updating the proposal
    const updatedProposals = proposals.map(proposal => {
      if (proposal.id === selectedProposal?.id) {
        if (voteDirection === 'for') {
          return { ...proposal, for_votes: proposal.for_votes + voteAmount };
        } else {
          return { ...proposal, against_votes: proposal.against_votes + voteAmount };
        }
      }
      return proposal;
    });
    
    setProposals(updatedProposals);
    handleCloseVoteDialog();
    
    // Reset form
    setVoteAmount(0);
    setVoteDirection('for');
  };

  const filteredProposals = proposals.filter(proposal => {
    if (filter === 'all') return true;
    if (filter === 'active') return proposal.status === 'active';
    if (filter === 'completed') return proposal.status === 'completed';
    return proposal.category === filter;
  });

  const getProgressColor = (proposal: any) => {
    const totalVotes = proposal.for_votes + proposal.against_votes;
    if (totalVotes < proposal.quorum) return 'warning';
    return proposal.for_votes > proposal.against_votes ? 'success' : 'error';
  };

  const getVotePercentage = (proposal: any) => {
    const totalVotes = proposal.for_votes + proposal.against_votes;
    if (totalVotes === 0) return 0;
    return (proposal.for_votes / totalVotes) * 100;
  };

  const getQuorumPercentage = (proposal: any) => {
    const totalVotes = proposal.for_votes + proposal.against_votes;
    return (totalVotes / proposal.total_eligible_votes) * 100;
  };

  const formatVotes = (votes: number) => {
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}M`;
    } else if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    }
    return votes.toString();
  };

  const getTimeRemaining = (proposal: any) => {
    if (proposal.status === 'completed') {
      return 'Voting ended';
    }
    
    const now = Date.now();
    const remaining = proposal.end_time - now;
    
    if (remaining <= 0) {
      return 'Voting ended';
    }
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    return `${days}d ${hours}h remaining`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Governance
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Proposals" />
            <Tab label="Voting Power" />
            <Tab label="DAO Treasury" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Button
                variant={filter === 'all' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setFilter('all')}
              >
                All Proposals
              </Button>
              <Button
                variant={filter === 'active' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={filter === 'completed' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={filter === 'parameter_change' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setFilter('parameter_change')}
              >
                Parameter Changes
              </Button>
              <Button
                variant={filter === 'treasury' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setFilter('treasury')}
              >
                Treasury
              </Button>
            </Box>

            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenProposalDialog}
                disabled={!connected}
              >
                Create Proposal
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {filteredProposals.map((proposal) => (
              <Grid item xs={12} key={proposal.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {proposal.title}
                      </Typography>
                      <Chip
                        label={proposal.status === 'active' ? 'Active' : proposal.result === 'passed' ? 'Passed' : 'Rejected'}
                        color={proposal.status === 'active' ? 'primary' : proposal.result === 'passed' ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={proposal.category.replace('_', ' ')}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Proposed by: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {proposal.description}
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">
                          For: {formatVotes(proposal.for_votes)} ({((proposal.for_votes / (proposal.for_votes + proposal.against_votes || 1)) * 100).toFixed(1)}%)
                        </Typography>
                        <Typography variant="body2">
                          Against: {formatVotes(proposal.against_votes)} ({((proposal.against_votes / (proposal.for_votes + proposal.against_votes || 1)) * 100).toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getVotePercentage(proposal)}
                        color={getProgressColor(proposal)}
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                      />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Quorum: {formatVotes(proposal.for_votes + proposal.against_votes)} / {formatVotes(proposal.quorum)} ({getQuorumPercentage(proposal).toFixed(1)}%)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getTimeRemaining(proposal)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        AI Analysis
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Recommendation
                          </Typography>
                          <Typography variant="body2">
                            <Chip
                              label={proposal.ai_analysis.recommendation}
                              size="small"
                              color={proposal.ai_analysis.recommendation === 'for' ? 'success' : proposal.ai_analysis.recommendation === 'against' ? 'error' : 'default'}
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Confidence
                          </Typography>
                          <Typography variant="body2">
                            {(proposal.ai_analysis.confidence * 100).toFixed(0)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Impact
                          </Typography>
                          <Typography variant="body2">
                            <Chip
                              label={proposal.ai_analysis.impact}
                              size="small"
                              color={proposal.ai_analysis.impact === 'high' ? 'primary' : proposal.ai_analysis.impact === 'medium' ? 'secondary' : 'default'}
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Risk
                          </Typography>
                          <Typography variant="body2">
                            <Chip
                              label={proposal.ai_analysis.risk}
                              size="small"
                              color={proposal.ai_analysis.risk === 'high' ? 'error' : proposal.ai_analysis.risk === 'medium' ? 'warning' : 'success'}
                            />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    {proposal.status === 'active' && (
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => handleOpenVoteDialog(proposal)}
                        disabled={!connected}
                      >
                        Vote
                      </Button>
                    )}
                    <Button size="small">View Details</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {connected ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Your Voting Power
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      125,000 HNC
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      1.25% of total voting power
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Voting History
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Voted FOR 'Increase Block Size to 2MB'"
                          secondary="50,000 HNC • 3 days ago"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Voted AGAINST 'Reduce Transaction Fees by 20%'"
                          secondary="75,000 HNC • 18 days ago"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Delegation
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      You can delegate your voting power to other addresses to vote on your behalf.
                    </Typography>
                    
                    <TextField
                      margin="dense"
                      label="Delegate Address"
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2, mt: 2 }}
                    />
                    
                    <TextField
                      margin="dense"
                      label="Amount (HNC)"
                      fullWidth
                      variant="outlined"
                      type="number"
                      sx={{ mb: 2 }}
                    />
                    
                    <Button variant="contained" color="primary" fullWidth>
                      Delegate Voting Power
                    </Button>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Active Delegations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You have no active delegations.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" gutterBottom>
                Connect your wallet to view your voting power
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Connect Wallet
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Treasury Overview
                  </Typography>
                  <Typography variant="h3" gutterBottom>
                    250,000,000 HNC
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    $125,000,000 USD
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Allocation
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Development Grants
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={40}
                        color="primary"
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                      />
                      <Typography variant="body2">
                        100,000,000 HNC (40%)
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Marketing
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={20}
                        color="secondary"
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                      />
                      <Typography variant="body2">
                        50,000,000 HNC (20%)
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Partnerships
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={25}
                        color="success"
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                      />
                      <Typography variant="body2">
                        62,500,000 HNC (25%)
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Reserve
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={15}
                        color="warning"
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                      />
                      <Typography variant="body2">
                        37,500,000 HNC (15%)
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Treasury Transactions
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Allocated 1,000,000 HNC to Developer Grants"
                        secondary="Proposal #4 • 7 days ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Allocated 500,000 HNC to Marketing Campaign"
                        secondary="Proposal #2 • 14 days ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Allocated 2,000,000 HNC to Exchange Listings"
                        secondary="Proposal #1 • 30 days ago"
                      />
                    </ListItem>
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Treasury Growth
                  </Typography>
                  <Box sx={{ height: 200, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 5 }}>
                      [Treasury Growth Chart]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>

      {/* Create Proposal Dialog */}
      <Dialog open={openProposalDialog} onClose={handleCloseProposalDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create Governance Proposal</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Proposal Title"
            fullWidth
            variant="outlined"
            value={newProposal.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={6}
            value={newProposal.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newProposal.category}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="parameter_change">Parameter Change</MenuItem>
              <MenuItem value="protocol_upgrade">Protocol Upgrade</MenuItem>
              <MenuItem value="treasury">Treasury Allocation</MenuItem>
              <MenuItem value="fee_structure">Fee Structure</MenuItem>
              <MenuItem value="reward_structure">Reward Structure</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" gutterBottom>
            Proposal Requirements
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            • You must hold at least 10,000 HNC to create a proposal
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            • Voting period: 7 days
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            • Quorum: 20% of total voting power
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Majority vote required to pass
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProposalDialog}>Cancel</Button>
          <Button onClick={handleSubmitProposal} variant="contained" color="primary">
            Create Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vote Dialog */}
      {selectedProposal && (
        <Dialog open={openVoteDialog} onClose={handleCloseVoteDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Vote on Proposal</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {selectedProposal.title}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Vote</InputLabel>
              <Select
                value={voteDirection}
                label="Vote"
                onChange={handleVoteDirectionChange}
              >
                <MenuItem value="for">For</MenuItem>
                <MenuItem value="against">Against</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle2" gutterBottom>
              Voting Power: 125,000 HNC
            </Typography>
            
            <Typography gutterBottom>
              Amount to Vote: {voteAmount.toLocaleString()} HNC
            </Typography>
            <Slider
              value={voteAmount}
              onChange={handleVoteAmountChange}
              aria-labelledby="vote-amount-slider"
              valueLabelDisplay="auto"
              step={1000}
              marks
              min={0}
              max={125000}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                AI Recommendation
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={selectedProposal.ai_analysis.recommendation}
                    color={selectedProposal.ai_analysis.recommendation === 'for' ? 'success' : selectedProposal.ai_analysis.recommendation === 'against' ? 'error' : 'default'}
                  />
                  <Typography variant="body2">
                    Confidence: {(selectedProposal.ai_analysis.confidence * 100).toFixed(0)}%
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This proposal has a {selectedProposal.ai_analysis.impact} impact with {selectedProposal.ai_analysis.risk} risk.
                </Typography>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVoteDialog}>Cancel</Button>
            <Button
              onClick={handleVote}
              variant="contained"
              color="primary"
              disabled={voteAmount <= 0}
            >
              Submit Vote
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Governance;
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Rating,
  LinearProgress,
} from '@mui/material';
import { useWallet } from '../contexts/WalletContext';

// Simulated AI models data
const mockModels = [
  {
    id: 'model1',
    name: 'HyperNova Consensus Model',
    description: 'Primary consensus model for the HyperNova Chain, optimized for security and performance.',
    owner: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    model_type: 'tensorflow',
    tags: ['consensus', 'security', 'core'],
    created_at: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    rating: 4.8,
    rating_count: 156,
    access_price: '1000',
    usage_count: 12500,
  },
  {
    id: 'model2',
    name: 'Quantum Resistant Encryption',
    description: 'Advanced encryption model designed to resist quantum computing attacks.',
    owner: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
    model_type: 'pytorch',
    tags: ['encryption', 'quantum', 'security'],
    created_at: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    rating: 4.5,
    rating_count: 89,
    access_price: '2500',
    usage_count: 7800,
  },
  {
    id: 'model3',
    name: 'Transaction Anomaly Detector',
    description: 'AI model for detecting suspicious or fraudulent transactions in real-time.',
    owner: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
    model_type: 'tensorflow',
    tags: ['security', 'fraud', 'transactions'],
    created_at: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    rating: 4.2,
    rating_count: 64,
    access_price: '1500',
    usage_count: 5200,
  },
  {
    id: 'model4',
    name: 'Smart Contract Optimizer',
    description: 'Optimizes smart contract code for efficiency and security.',
    owner: '0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w',
    model_type: 'pytorch',
    tags: ['smart-contracts', 'optimization', 'development'],
    created_at: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    rating: 4.0,
    rating_count: 42,
    access_price: '1800',
    usage_count: 3100,
  },
];

const AIModels: React.FC = () => {
  const { connected, address } = useWallet();
  const [models, setModels] = useState(mockModels);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New model form state
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    model_type: 'tensorflow',
    tags: '',
    access_price: '',
    file: null as File | null,
  });

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleOpenModelDialog = (model: any) => {
    setSelectedModel(model);
    setOpenModelDialog(true);
  };

  const handleCloseModelDialog = () => {
    setOpenModelDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewModel({ ...newModel, [name]: value });
  };

  const handleSelectChange = (e: any) => {
    setNewModel({ ...newModel, model_type: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewModel({ ...newModel, file: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    // In a real implementation, this would upload the model to the backend
    console.log('Uploading model:', newModel);
    
    // Simulate adding a new model
    const newModelData = {
      id: `model${models.length + 1}`,
      name: newModel.name,
      description: newModel.description,
      owner: address,
      model_type: newModel.model_type,
      tags: newModel.tags.split(',').map(tag => tag.trim()),
      created_at: Date.now(),
      rating: 0,
      rating_count: 0,
      access_price: newModel.access_price,
      usage_count: 0,
    };
    
    setModels([...models, newModelData]);
    handleCloseUploadDialog();
    
    // Reset form
    setNewModel({
      name: '',
      description: '',
      model_type: 'tensorflow',
      tags: '',
      access_price: '',
      file: null,
    });
  };

  const handlePurchaseAccess = (modelId: string) => {
    // In a real implementation, this would purchase access to the model
    console.log('Purchasing access to model:', modelId);
  };

  const filteredModels = models.filter(model => {
    // Filter by search term
    const matchesSearch = 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category
    if (filter === 'all') return matchesSearch;
    if (filter === 'owned' && model.owner === address) return matchesSearch;
    if (filter === 'purchased') return matchesSearch; // In a real app, this would check purchased models
    
    // Filter by tag
    return model.tags.includes(filter) && matchesSearch;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Models Marketplace
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setFilter('all')}
          >
            All Models
          </Button>
          <Button
            variant={filter === 'owned' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setFilter('owned')}
            disabled={!connected}
          >
            My Models
          </Button>
          <Button
            variant={filter === 'purchased' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setFilter('purchased')}
            disabled={!connected}
          >
            Purchased
          </Button>
          <Button
            variant={filter === 'consensus' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setFilter('consensus')}
          >
            Consensus
          </Button>
          <Button
            variant={filter === 'security' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setFilter('security')}
          >
            Security
          </Button>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenUploadDialog}
            disabled={!connected}
          >
            Upload Model
          </Button>
        </Box>
      </Box>

      <TextField
        fullWidth
        label="Search Models"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredModels.map((model) => (
          <Grid item xs={12} sm={6} md={4} key={model.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {model.name}
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  {model.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                      onClick={() => setFilter(tag)}
                    />
                  ))}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {model.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={model.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({model.rating_count})
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Price: {model.access_price} HNC
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Uses: {model.usage_count.toLocaleString()}
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button size="small" onClick={() => handleOpenModelDialog(model)}>
                  View Details
                </Button>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handlePurchaseAccess(model.id)}
                  disabled={!connected || model.owner === address}
                >
                  {model.owner === address ? 'Owned' : 'Purchase Access'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Model Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload AI Model</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Model Name"
            fullWidth
            variant="outlined"
            value={newModel.name}
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
            rows={4}
            value={newModel.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Model Type</InputLabel>
            <Select
              value={newModel.model_type}
              label="Model Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="tensorflow">TensorFlow</MenuItem>
              <MenuItem value="pytorch">PyTorch</MenuItem>
              <MenuItem value="onnx">ONNX</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="tags"
            label="Tags (comma separated)"
            fullWidth
            variant="outlined"
            value={newModel.tags}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="access_price"
            label="Access Price (HNC)"
            fullWidth
            variant="outlined"
            type="number"
            value={newModel.access_price}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Upload Model File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          
          {newModel.file && (
            <Typography variant="body2" color="text.secondary">
              Selected file: {newModel.file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Model Details Dialog */}
      {selectedModel && (
        <Dialog open={openModelDialog} onClose={handleCloseModelDialog} maxWidth="md" fullWidth>
          <DialogTitle>{selectedModel.name}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedModel.description}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedModel.tags.map((tag: string) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      color="primary"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Accuracy
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={95} color="success" sx={{ height: 10, borderRadius: 5 }} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">95%</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Inference Speed
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={88} color="primary" sx={{ height: 10, borderRadius: 5 }} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">88%</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  Details
                </Typography>
                <Typography variant="body2">
                  <strong>Owner:</strong> {selectedModel.owner.slice(0, 8)}...{selectedModel.owner.slice(-6)}
                </Typography>
                <Typography variant="body2">
                  <strong>Model Type:</strong> {selectedModel.model_type}
                </Typography>
                <Typography variant="body2">
                  <strong>Created:</strong> {new Date(selectedModel.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Access Price:</strong> {selectedModel.access_price} HNC
                </Typography>
                <Typography variant="body2">
                  <strong>Usage Count:</strong> {selectedModel.usage_count.toLocaleString()}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={selectedModel.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {selectedModel.rating} ({selectedModel.rating_count} reviews)
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handlePurchaseAccess(selectedModel.id)}
                  disabled={!connected || selectedModel.owner === address}
                  sx={{ mb: 1 }}
                >
                  {selectedModel.owner === address ? 'You Own This Model' : `Purchase Access (${selectedModel.access_price} HNC)`}
                </Button>
                
                {selectedModel.owner === address && (
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                  >
                    Edit Model
                  </Button>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModelDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AIModels;
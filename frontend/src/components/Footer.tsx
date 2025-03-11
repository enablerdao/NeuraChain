import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { GitHub, Twitter, Telegram } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              HyperNova Chain
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Next-generation blockchain with AI, quantum resistance, and scalability
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="#" color="inherit">Documentation</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="#" color="inherit">Whitepaper</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="#" color="inherit">API Reference</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="#" color="inherit">GitHub</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect
            </Typography>
            <Box>
              <IconButton color="primary" aria-label="GitHub">
                <GitHub />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="Telegram">
                <Telegram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' HyperNova Chain. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
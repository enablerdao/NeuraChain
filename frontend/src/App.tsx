import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import Wallet from './pages/Wallet';
import AIModels from './pages/AIModels';
import Governance from './pages/Governance';
import { WalletProvider } from './contexts/WalletContext';
import { NetworkProvider } from './contexts/NetworkContext';

function App() {
  return (
    <NetworkProvider>
      <WalletProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
          }}
        >
          <Header />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/ai-models" element={<AIModels />} />
              <Route path="/governance" element={<Governance />} />
            </Routes>
          </Container>
          <Footer />
        </Box>
      </WalletProvider>
    </NetworkProvider>
  );
}

export default App;
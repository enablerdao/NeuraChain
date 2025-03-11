import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Explore as ExploreIcon,
  AccountBalanceWallet as WalletIcon,
  Psychology as AIIcon,
  HowToVote as GovernanceIcon,
} from '@mui/icons-material';
import { useWallet } from '../contexts/WalletContext';
import { useNetwork } from '../contexts/NetworkContext';

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { connected, address, connect, disconnect } = useWallet();
  const { networkName, blockHeight } = useNetwork();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Explorer', icon: <ExploreIcon />, path: '/explorer' },
    { text: 'Wallet', icon: <WalletIcon />, path: '/wallet' },
    { text: 'AI Models', icon: <AIIcon />, path: '/ai-models' },
    { text: 'Governance', icon: <GovernanceIcon />, path: '/governance' },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={RouterLink} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ background: 'rgba(30, 30, 30, 0.8)', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="HyperNova Chain"
            sx={{ height: 40, mr: 1 }}
          />
          HyperNova Chain
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                sx={{ mx: 1 }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={`${networkName} | Block: ${blockHeight}`}
            color="secondary"
            size="small"
            sx={{ mr: 2 }}
          />

          {connected ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={disconnect}
              sx={{ borderRadius: 4 }}
            >
              {address.slice(0, 6)}...{address.slice(-4)}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={connect}
              sx={{ borderRadius: 4 }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
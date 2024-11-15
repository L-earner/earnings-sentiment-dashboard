import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GitHubIcon from '@mui/icons-material/GitHub';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <ShowChartIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Earnings Call Analysis Dashboard
        </Typography>
        <Box>
          <IconButton
            color="inherit"
            href="https://github.com/yourusername/earnings-dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

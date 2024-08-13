import './App.css';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, IconButton, Typography } from '@mui/material';
import Menu from '@mui/icons-material/Menu';

function PageLayout() {
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography className="text-left" variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Statistics
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default PageLayout;

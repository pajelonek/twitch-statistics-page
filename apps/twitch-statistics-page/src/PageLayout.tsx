import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, IconButton, Typography, Card } from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';

function PageLayout() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const responseTest = fetch('https://raw.githubusercontent.com/pajelonek/twitch-statistics-page/master/apps/twitch-statistics-page/public/data/test/data.json')
    .then(function(response){
      console.log('test2: ' + response)
      return response.json();
    })
    .then(function(myJson) {
      setData(myJson.test);
    });
  }, []);


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
      <Card>TEST + {data} </Card>
    </div>
  );
}

export default PageLayout;

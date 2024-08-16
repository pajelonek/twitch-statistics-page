import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, IconButton, Typography, Card } from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';

function PageLayout() {

  const [data, setData] = useState<any>(null);
  const resourceUrl = import.meta.env.VITE_RESOURCE_URL;
  useEffect(() => {
    fetch(resourceUrl + 'data/test/data.json'
      ,{
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      }
      )
        .then(function(response){
          console.log(response)
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
            <h1>Vite is running in %MODE%</h1>
          </Toolbar>
        </AppBar>
      </Box>
      <Card>TEST + {data} </Card>
    </div>
  );
}

export default PageLayout;

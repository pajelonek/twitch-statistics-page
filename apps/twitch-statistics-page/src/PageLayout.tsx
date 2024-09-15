import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination } from '@mui/material';
import Menu from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

function PageLayout() {

  const [data, setData] = useState<any>(null);
  const resourceUrl = import.meta.env.VITE_RESOURCE_URL;
  useEffect(() => {
    fetch(resourceUrl + 'data/test/summary.json'
      ,{
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      }
      )
        .then(function(response){
          return response.json();
        })
        .then(function(myJson) {
          setData(myJson);
        });
  }, []);
  console.log("data: ", data)
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
      {data && data.length > 0 && (
            <TableContainer >
              <Table sx={{ maxWidth: 650, border: 1 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>WatchHours</TableCell>
                    <TableCell>AvgViewers</TableCell>
                    <TableCell>PeakViewers</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((streamer: any) => (
                    <>
                    <TableRow 
                    sx={{ border: 1 }}
                      key={streamer.streamerLogin}
                    >
                      <TableCell component="th" scope="row">
                        {streamer.streamerLogin}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {streamer.statistics.watchHours}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {streamer.statistics.avgViewers}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {streamer.statistics.peakViewers}
                      </TableCell>
                    </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
              <TableFooter>
            <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={4}
                  count={data.length}
                  rowsPerPage={25}
                  page={0}
                  slotProps={{
                    select: {
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    },
                  }}
                  onPageChange={() => {}}
                  onRowsPerPageChange={() => {}}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </TableContainer>
      )}
    </div>
  );
}

export default PageLayout;

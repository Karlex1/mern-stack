import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {  Container, IconButton, Typography } from '@mui/material';
import dayjs from "dayjs";
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

export default function TTable({ data, fetchTransaction, setEditTransaction }) {
 
  const token = Cookies.get('user_token')
const user = useSelector((state)=>state.auth.user)

  function getCategoryName(id) {
    const category = user.categories.find((category) => category._id === id);
    return category ? category.label : 'NA';
  }

  function formatDate(date) {
    return dayjs(date).format('DD/MM/YYYY')
  }

  async function remove(_id) {
    if (!window.confirm('Are you sure')) return;
    const res = await fetch( `${process.env.REACT_APP_API_URL}/transaction/${_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      fetchTransaction();
      }
  }
  return (
    <Container>
      <TableContainer component={Paper} sx={{ borderRadius: '15px', backgroundColor: 'rgb(240,255,252)' ,marginBottom:2}} >
        <Typography variant="h6" fontFamily='cursive'
          sx={{ marginBottom: 1, marginLeft: 2, marginTop: 2 }}>  Transaction List  </Typography>
        <Table sx={{ minWidth: 550 }} size="small" aria-label="a dense table" >
          <TableHead>
            <TableRow>
              <TableCell align='center'>Amount</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align='center'>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* here below we  did map month then we r getting data from the amouth,desc,date,category n all... all this we r sending from backend  */}
            {data.map((month) => (month.transactions.map((e, _id) => (
              <TableRow key={_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                <TableCell component="th" scope="row" align='center'>
                  {e.amount}
                </TableCell>
                <TableCell align='center'>
                  {e.description}
                </TableCell>
                <TableCell align='center'>{formatDate(e.date)}
                </TableCell>
                <TableCell align='center'>{getCategoryName(e.category_id)}
                </TableCell>
                <TableCell align='center'>
                  < IconButton sx={{ marginRight: 0.5 }} color='primary' onClick={() => setEditTransaction(e)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color='warning' onClick={() => {
                    remove(e._id)
                  }}>
                    <DeleteIcon />
                  </ IconButton>
                </TableCell>
              </TableRow>))))}
            
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
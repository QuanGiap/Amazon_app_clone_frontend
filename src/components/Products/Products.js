import React from 'react'
import './Products.css';
import './Product.css';
import {Grid,Paper,Typography,Button} from '@mui/material'
import {nanoid} from 'nanoid'
import { useNavigate } from 'react-router-dom';

export default function Products({products=[]}) {
  const nav = useNavigate();
  const products_cmpt = products.map(({user_name,product_image,product_name,product_price,product_discount,product_quantity,create_date,id})=>{
    return <Grid item className='product_grid_item' key={nanoid()} onClick={()=>nav('/product/'+id)}><Product user_name={user_name} image={product_image?.data} discount={product_discount} quanity={product_quantity} price={product_price} product_name={product_name}/></Grid>
  })
  return (
    <Grid container spacing={3} alignContent='center' justifyContent='center'>
      {products_cmpt}
    </Grid>
  )
}
function Product({user_name,image="",product_name,price,discount,quanity}) {
  const is_discount = discount > 0;
  const dollar = Number.parseInt(price/100);
  const penny = price%100;
  const discount_price = Math.ceil(price * ((100-discount)/100));
  const real_dollar = Math.floor(discount_price/100);
  const real_penny = discount_price%100;
  return (
    <Paper className='product_paper'>
      <Grid container direction={"column"} spacing={1} alignContent='center'>
        <Grid item alignSelf="center">
          <img src={"data:image/jpeg;base64,"+image || ""} alt="product" className="product_image"/>
        </Grid>
        <Grid item>
          <Grid container direction={"column"} textAlign="center">
            <Grid item xs={12}>
              <Typography variant='h6' className='product_name'>{product_name || "product name empty"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' style={{textDecoration: (is_discount) ? "line-through" : "inital"}}>Price:{dollar}.{penny}$</Typography>
            </Grid>
            {is_discount && <Grid item xs={12}>
              <Typography variant='body1'>Real price:{real_dollar}.{real_penny}$</Typography>
            </Grid>}
            <Grid item xs={12}>
              <Typography variant='body1'>In stoke:{quanity}</Typography>
            </Grid>
            {/* <Grid item xs = {12}>
              <Button></Button>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
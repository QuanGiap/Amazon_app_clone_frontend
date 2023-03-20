import { Paper,Grid, Typography, Button} from '@mui/material';
import React from 'react'
import "./Product.css";

export default function Product({user_name,image="",product_name,price,discount,quanity}) {
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
            <Grid item xs = {12}>
              <Button></Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

import React from 'react'
import './Products.css';
import {Grid} from '@mui/material'
import {nanoid} from 'nanoid'
import Product from '../Product/Product';

export default function Products({products=[]}) {
  const products_cmpt = products.map(({user_name,product_image,product_name,product_price,product_discount,product_quantity,create_date,id})=>{
    return <Grid item key={nanoid()}><Product user_name={user_name} image={product_image?.data} discount={product_discount} quanity={product_quantity} price={product_price} product_name={product_name}/></Grid>
  })
  return (
    <Grid container spacing={2}>
      {products_cmpt}
    </Grid>
  )
}

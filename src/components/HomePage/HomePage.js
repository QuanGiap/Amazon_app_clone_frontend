import { Grid } from '@mui/material'
import React,{useState,useEffect} from 'react'
import { getProducts,sendImg,getProductById } from '../tools/axiosFetch';
import { useQuery } from 'react-query';
import {nanoid} from 'nanoid';

import "./HomePage.css";
import Products from '../Products/Products';

export default function HomePage() {
  const [products,setProducts] = useState([]);
  const [limit,setLimit] = useState(5);
  const [page,setPage] = useState(0);
  const [name_search,setNameSearch] = useState("");
  const {isLoading,isError,error} = useQuery(['products',page],()=>getProducts({name_search,amount:limit,page}),{onSuccess:(data)=>{
    setProducts(data.data.data.products);
  }});
  if(isLoading) return <div>Loading</div>
  if(isError) return <div>{error.message}</div>
  return (
    <Grid container spacing={2} direction={"column"} className="homepage_display">
      <Products products={products}/>
    </Grid>
  )
}

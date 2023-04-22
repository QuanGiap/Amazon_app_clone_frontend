import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getProducts, sendImg } from "../../tools/axiosFetch";
import { useQuery } from "react-query";
import { nanoid } from "nanoid";

import "./HomePage.css";
import Products from "../../Products/Products";
import PageNumberBar from "../../PageNumber/PageNumberBar";
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [total_products, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [name_search, setNameSearch] = useState("");
  const {isLoading,isFetching, isError, error, refetch } = useQuery(
    ["products", page],
    () => getProducts({ name_search, amount: limit, page }),
    {
      enabled:false,
      onSuccess: (result) => {
        setProducts(result.data.data.products);
        setTotalProducts(result.data.data.total_products)
      },
      refetchOnWindowFocus: false
    }
  );
  useEffect(()=>{
    refetch();
  },[page])
  const max = Math.ceil(total_products/limit);
  const onSelectPage = (number) =>{
    setProducts([]);
    setPage(number-1);
  }
  if (isError) return <div>{error.message}</div>;
  return (
    <Grid
      container
      direction={"column"}
      className="homepage_display"
    >
      <Grid item>
        <Grid container spacing={1} direction={"row"} alignContent="center" justifyContent="center">
          <Grid item xs={7}>
            <TextField
              label="Search"
              value={name_search}
              onChange={(e) => setNameSearch(e.target.value)}
              fullWidth
              onKeyDown={(e) => onEnter(e,refetch)}
              type={'search'}
            />
          </Grid>
          <Grid item>
            <Button className="search_button" variant="contained" onClick={refetch}>Search</Button>
          </Grid>
        </Grid>
      </Grid>
      {isFetching && <Grid item>
        <Typography variant="h4" textAlign={'center'}>Loading...</Typography>
      </Grid>}
      <Grid item xs={12} style={{paddingTop:"10px"}}>
          <Products products={products} />
      </Grid>
      <Grid item xs={12} alignSelf='center'>
        <PageNumberBar max={max} onSelectPage={onSelectPage} current_page={page+1}/>
      </Grid>
    </Grid>
  );
}
function onEnter(e, funct) {
  if (e.key === "Enter") {
    funct?.();
  }
}

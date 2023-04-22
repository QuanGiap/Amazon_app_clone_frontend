import "./InspectProductPage.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getProductById } from "../../tools/axiosFetch";
import { Button, Grid, Typography,TextField} from "@mui/material";
export default function InspectProductPage({onClickContact=()=>{},onClickAddBasket=()=>{}}) {
  let { product_id } = useParams();
  const [amount,setAmount] = useState(1)
  const { isLoading, isFetching, isError, error, refetch, data } = useQuery(
    ["product", product_id],
    () => getProductById({ product_id })
  );
  const { person_id,user_name,product_image, product_name,product_describe,product_discount,product_quantity,product_price} = data?.data.data.products[0] || {};
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;
  const is_discount = product_discount > 0;
  const dollar = Number.parseInt(product_price/100);
  const penny = product_price%100;
  const discount_price = Math.ceil(product_price * ((100-product_discount)/100));
  const real_dollar = Math.floor(discount_price/100);
  const real_penny = discount_price%100;
  function onChange(e){
    let input = e.target.value ;
    if( !input || ( input[input.length-1].match('[0-9]') && input[0].match('[1-9]')) )
      setAmount(input)
  }
  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={12} md={6} className="product_inspect_img_grid">
        <img
          src={"data:image/jpeg;base64," + product_image?.data || ""}
          className="product_inspect_img"
          alt="Product"
        />
      </Grid>
      <Grid item md={6}>
        <Grid container direction={"column"} className="product_inspect_info_grid_container" spacing={2}>
          <Grid item>
            <Typography variant="h3">{product_name}</Typography>
          </Grid>
            <Grid item><Typography variant="body">{product_describe}</Typography></Grid>
            <Grid item>
              <Typography variant='body2' style={{textDecoration: (is_discount) ? "line-through" : "inital"}}>Price:{dollar}.{penny}$</Typography>
            </Grid>
            {is_discount && <Grid item>
              <Typography variant='body2'>Real price:{real_dollar}.{real_penny}$</Typography>
            </Grid>}
            <Grid item>
              <Typography variant='body1'>In stoke:{product_quantity}</Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={1} direction="row" justifyContent="center" >
                <Grid item>
                  <Button variant="outlined" onClick={()=>onClickContact({user_name,person_id})}>Contact the seller</Button>
                </Grid>
                <Grid item>
                  <TextField label='amount' value={amount} onChange={onChange} type="text" inputMode="numeric"  InputProps={{
        inputProps: { min: 0 }
      }}/>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={()=>onClickAddBasket({amount,product_id})}>Add to basket</Button>
                </Grid>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

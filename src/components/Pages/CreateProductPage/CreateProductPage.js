import "./CreateProductPage.css"
import React,{useEffect,useState} from 'react'
import { Grid, Paper, TextField, Button, Typography } from "@mui/material";
import {useNavigate} from 'react-router-dom'
import { postImg, postProduct } from "../../tools/axiosFetch";

const IMAGE_SIZE_MAX = 500000
const reader = new FileReader();
export default function CreateProductPage({user_id}) {
  const nav =useNavigate();
  const [product_file,setFile] = React.useState("");
  const [src_img,setSrcImg] = React.useState("");
  const [img_name,setImgName] = useState("");
  const [product_name,setProductName] = useState("");
  const [product_describe,setProductDescribe] = useState("");
  const [product_price,setProductPrice] = useState(0);
  const [product_discount,setProductDiscount] = useState("");
  const [product_quantity,setProductQuantity] = useState("");
  const [errorText, setErrorText] = useState("");
  useEffect(()=>{
    if(!localStorage.getItem("access_token")) nav("/sign_in");
    const check = reader.onload = (e)=>{
      setSrcImg(e.target.result);
      console.log("Reading");
    }
  },[])
  useEffect(()=>{
    if(product_file){
      reader.readAsDataURL(product_file);  
    }
  },[product_file])
  
  const checkValues = ()=>{
    setErrorText("");
    let isError = false;
    const valueCheck = {product_quantity,product_price,product_describe,product_name,product_file};
    //check if any value is null
    Object.entries(valueCheck).forEach(([key,value])=>{
      if(!value){
        isError = true;
        setErrorText(key + " not found");
        return;
      }
    })
    if(isError) return false;;
    if(product_name.length < 5){
      setErrorText("Product's name must be greater than 5 words");
      return false;
    }
    if(!Number.isInteger(product_quantity)){
      setErrorText("Quantity must be an integer");
      return false;
    }
    if(product_discount<0 || product_discount>100 || !Number.isInteger(product_discount)){
      setErrorText("Product discount only accept from 0 to 100 and it is an integer number");
      return false;
    }
    if(product_discount<0 || !Number.isInteger(product_discount)){
      setErrorText("Product quantity only accept posititve integer number");
      return false;
    }
    if(product_file.size > IMAGE_SIZE_MAX){
      setErrorText("Image size must be less than 0.5 mb");
      return false;
    }
    return true;
  }
  const uploadProduct = async () =>{
    try{
      if(!checkValues()) return;
      const result_post_info = await postProduct({product_describe,product_name,product_discount,product_price,product_quantity});
      const result_post_img = await postImg({img_file: product_file,product_id:result_post_info.data?.data?.productId});
      setErrorText("Post product success")
    }catch(err){
      console.log(err)
      setErrorText("Post product fail")
    }
  }
  const setImage = (e) =>{
    const file = e.target.files[0];
    const name = e.target.value;
    setFile(file);
    setImgName(name);
  }
  return (
    <Grid container justifyContent={"center"} alignContent={"center"}>
        <Grid item xs={8}>
          <Paper className="product_insert_paper">
            <Grid
              container
              direction={"column"}
              spacing={1}

            >
              <Grid item>
                <Typography variant="h4" textAlign="center">Create new product</Typography>
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label={"Your product name"}
                  value={product_name}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={product_describe}
                  label={"Your desciption for product"}
                  onChange={(e)=> setProductDescribe(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  type={"number"}
                  value={product_price}
                  label={"Your price for product"}
                  onChange={(e)=> setProductPrice(Number(e.target.value))}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  type={"number"}
                  value={product_discount}
                  label={"Set discount for product (accept from 0 to 100)"}
                  onChange={(e)=> setProductDiscount(Number(e.target.value))}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  type={"number"}
                  value={product_quantity}
                  label={"How many do you have?"}
                  onChange={(e)=> setProductQuantity(Number(e.target.value))}
                />
              </Grid>
              <Grid item alignSelf="center">
                <div>Choose image for you product</div>
                <input type="file" multiple={false} accept="image/jpeg" value={img_name} onChange={(e)=> setImage(e)}/>
              </Grid>
              {errorText && <Grid item><Typography textAlign="center" variant="h5" color={"red"}>{errorText}</Typography></Grid>}
              <Grid item alignSelf="center">
                <div>Image preview</div>
                <img src={src_img} alt="You haven't insert yet" className="product_insert_img"/>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent="space-around">
                  <Grid item>
                    <Button variant="outlined">Clear information</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={uploadProduct}>Insert product</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
  )
}
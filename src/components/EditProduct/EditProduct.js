import "./EditProduct.css"
import React,{useEffect,useState} from 'react'
import { Grid, Paper, TextField, Button, Typography } from "@mui/material";
import { postImg, updateProduct } from "../tools/axiosFetch";
// import socket from "../tools/socketClient";
const IMAGE_SIZE_MAX = 500000
const reader = new FileReader();
export default function EditProduct({onClose=()=>{},onUpdate = () => {},prev_img="",prev_img_name="",prev_product_name="unknow",prev_product_descibe = "unknow",prev_product_price = -1,prev_product_discount = -1,prev_product_quanity = -1,product_id=-1}) {
  const [product_file,setFile] = React.useState(null);
  const [src_img,setSrcImg] = React.useState("data:image/jpeg;base64," + prev_img);
  const [img_name,setImgName] = useState(prev_img_name);
  const [product_name,setProductName] = useState(prev_product_name);
  const [product_describe,setProductDescribe] = useState(prev_product_descibe);
  const [product_price,setProductPrice] = useState(prev_product_price/100);
  const [product_discount,setProductDiscount] = useState(prev_product_discount);
  const [product_quantity,setProductQuantity] = useState(prev_product_quanity);
  const [errorText, setErrorText] = useState("");
  useEffect(()=>{
    reader.onload = (e)=>{
      console.log(e.target.result); 
      setSrcImg(e.target.result);
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
    const valueCheck = {product_quantity,product_price,product_describe,product_name};
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
    if(product_file && product_file.size > IMAGE_SIZE_MAX){
      setErrorText("Image size must be less than 0.5 mb");
      return false;
    }
    return true;
  }
  const startUpdate = async () =>{
    try{
      if(!checkValues()) return;
      setErrorText("Please wait")
      const result_update_info = await updateProduct({product_name,product_describe,product_price,product_discount,product_quantity,product_id})
      if(product_file) {
        await postImg({img_file: product_file,product_id});
      }
      const edit_img = src_img.slice(src_img.indexOf(",")+1);
      onUpdate(edit_img);
      onClose();
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
            <Grid
              container
              direction={"column"}
              spacing={1}
            >
              <Grid item>
                <Typography variant="h4" textAlign="center">Update product</Typography>
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
                <img src={src_img} alt="You haven't insert yet" className="product_edit_img"/>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent="space-around">
                  <Grid item>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={startUpdate}>Update product</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
  )
}
import "./ManageProductPage.css";
import React, { useState, useEffect } from "react";
import { deleteProduct, getProductsByUserId } from "../tools/axiosFetch";
import { Paper, Grid, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import EditProduct from "../EditProduct/EditProduct";
export default function ManageProductPage({ user_id = "" }) {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [index_edit, setIndexEdit] = useState(-1);
  const [is_open_popup, setOpenPopup] = useState(false);
  const [page, setPage] = useState(0);
  const [amount, setAmount] = useState(5);
  const { isFetching , isError, error, refetch } = useQuery(
    ["products_edits", page],
    () => getProductsByUserId({ user_id, amount, page }),
    {
      onSuccess: (data) => {
        setProducts(data.data.data.products);
      },
      enabled: user_id !== "",
      refetchOnWindowFocus:false
    }
  );
  useEffect(() => {
    if (!localStorage.getItem("access_token")) nav("/sign_in");
  }, []);
  const onClosePopUp = () => {
    setOpenPopup(false);
  };
  const onUpdate = (img) => {
    let products_cloned = [...products];
    products_cloned[index_edit].product_image.data = img;
    setProducts(products_cloned);
  };
  const product_edit_cpmts = products.map(
    ({
      user_name,
      product_image,
      product_name,
      product_price,
      product_discount,
      product_quantity,
      create_date,
      id,
      product_describe,
      is_updated = false,
    },index) => {
      const onClickEdit = () =>{
        setIndexEdit(index);
        setOpenPopup(true);
      }
      const onClickDelete = async() =>{
        await deleteProduct({product_id:id})
        const products_cloned = products.filter((value,_index)=>_index !== index);
        setProducts(products_cloned);
      }
      return (
        <Grid item key={nanoid()} className="edit_product_grid_item">
          <ProductEdit
            user_name={user_name}
            image={product_image?.data}
            discount={product_discount}
            quanity={product_quantity}
            price={product_price}
            product_name={product_name}
            description={product_describe}
            is_updated={is_updated}
            onClickEdit={onClickEdit}
            onClickDelete={onClickDelete}
          />
        </Grid>
      );
    }
  );
  const {
    product_image,
    product_name,
    product_price,
    product_discount,
    product_quantity,
    create_date,
    id,
    product_describe,
  } = products[index_edit] || {};
  if (isFetching) return <h3>Loading... please wait</h3>;
  if (isError) return <h3>{error}</h3>;
  return (
    <React.Fragment>
      <Grid
        container
        direction={"column"}
        className="edit_products_grid_container"
      >
        {product_edit_cpmts}
      </Grid>
      <PopUpWindow isOpen={is_open_popup}>
        <EditProduct
          onClose={onClosePopUp}
          onUpdate={(img)=>onUpdate(img)}
          prev_img={product_image?.data}
          prev_product_name={product_name}
          prev_product_descibe={product_describe}
          prev_product_price={product_price}
          prev_product_discount={product_discount}
          prev_product_quanity={product_quantity}
          product_id={id}
        />
      </PopUpWindow>
    </React.Fragment>
  );
}

function PopUpWindow({ isOpen = true, children }) {
  const check = () => {
    console.log("Clicked");
  };
  if (!isOpen) return;
  return (
    <div className="popUp_background">
      <Paper className="popUp_paper">{children}</Paper>
    </div>
  );
}

function ProductEdit({
  is_updated = false,
  image = "",
  product_name,
  price,
  discount,
  quanity,
  description = "",
  onClickEdit = () =>{},
  onClickDelete = () =>{},
}) {
  const dollar = Number.parseInt(price / 100);
  const penny = price % 100;
  return (
    <Paper className="product_edit_paper">
      <Grid container direction={"row"} spacing={1} alignContent="center">
        <Grid item alignSelf="center">
          <img
            src={is_updated ? image : "data:image/jpeg;base64," + image || ""}
            alt="product"
            className="product_edit_image"
          />
        </Grid>
        <Grid item>
          <Grid container direction={"column"} textAlign="center">
            <Grid item xs={12}>
              <Typography variant="h6" className="product_edit_name">
                {product_name || "product name empty"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Price:{dollar}.{penny}$
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Discount:{discount}%</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">In stoke:{quanity}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" className="product_edit_describe">
                {description}
              </Typography>
            </Grid>
            <Grid item xs={12} alignSelf="center">
              <Grid container direction={"row"} spacing={1}>
                <Grid item>
                  <IconButton onClick={onClickEdit}>
                    <EditIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={onClickDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

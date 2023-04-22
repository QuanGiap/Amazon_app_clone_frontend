import React,{useState} from "react";
import "./PageNumberBar.css";
import { nanoid } from "nanoid";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { TextField, Grid } from "@mui/material";

export default function PageNumberBar({ onSelectPage = () =>{},min = 1, max = 100 ,current_page = 1}) {
  const [page_number,setPageNumber] = useState(current_page);
  function onChange(e) {
    if(e.nativeEvent.data === '-') return;
    const new_number = Math.floor(Number(e.target.value));
    if(new_number<min) return;
    if(new_number>max) return;
    if (!e.nativeEvent.data) {
      setPageNumber(new_number);
      onSelectPage?.(new_number);
    }
    else{
      setPageNumber(new_number);
    }
  }
  function onEnter(e) {
    if (e.key === 'Enter') {
      console.log(page_number)
      onSelectPage?.(page_number);
    }
  }
  return (
    <Grid container alignContent='center' justifyContent='center'>
      <Grid item>
        <TextField
          className="page_input"
          inputProps={{min: 0, style: { textAlign: 'center' }}}
          label={"Page"}
          type={"number"}
          value={page_number}
          onChange={(e)=>onChange(e)}
          onKeyDown={(e)=>onEnter(e)}
        />
      </Grid>
    </Grid>
  );
}

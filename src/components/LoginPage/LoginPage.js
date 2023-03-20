import React from "react";
import "./LoginPage.css"
import { Grid, Paper, TextField,Button,Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signIn } from "../tools/axiosFetch";
export default function Login(props) {
    const [username,setUsername] = React.useState("");
    const [passsword,setPassword] = React.useState("");
    const [textAnnounce,setTextAnnounce] = React.useState("");
    const [isNotComfirm,setIsNotConfirm] = React.useState(false);
    const nav  = useNavigate();
    const sign_in = async () =>{
      setTextAnnounce("");
      setIsNotConfirm(false);
        try{
            if(!checkEnoughInfo()) throw new Error("Missing information");
            const result = await signIn({username,passsword});
            const authInfo = result.data.AuthenticationResult;
            localStorage.setItem("access_token",authInfo.AccessToken);
            localStorage.setItem("refresh_token",authInfo.RefreshToken);
            props.setUsername(username);
            props.navToMenuPage();
        }catch(err){
          //if the user is not confirm email
          if(err.response.data.developer?.name === "UserNotConfirmedException") setIsNotConfirm(true);
          setTextAnnounce(err.response?.data?.message||err.message)
        }
    }
    function moveToConfirmPage(){
      nav(`/confirm_code/${username}/${false}`);
    }
    function moveToForgotPassPage(){
      nav(`/forgot_pass`);
    }
  function checkEnoughInfo(){
    return username.length > 5 && passsword.length > 5;
  }
  return (
    <Grid container justifyContent="center" spacing={1} style={{padding:"45px"}}>
      <Grid item xs={6} >
        <Paper elevation={3} style={{padding:"20px"}}>
          <Grid container justifyContent="center" alignContent={"center"} spacing={1.5} direction={"column"}>
            <Grid item xs={12}>
                <Typography textAlign={"center"} variant={"h4"}>Sign in</Typography>
            </Grid>
            <Grid item xs={9}>
            <TextField label={"Username"} fullWidth value={username} onChange={(e)=>setUsername(e.target.value)}/>
            </Grid>
            <Grid item xs={9}>
            <TextField label={"Password"} type={"password"} fullWidth value={passsword} onChange={(e)=>setPassword(e.target.value)}/>
            </Grid>
           <Grid item xs={12}>
            <Grid container>
            <Grid item xs={4}>
            <Button variant="contained" onClick={sign_in} className="sign_in_button">Sign in</Button>
            </Grid>
            <Grid item xs={8}>
            <Button variant="outlined" onClick={moveToForgotPassPage}>Forgot password</Button>
            </Grid>
            </Grid>
           </Grid>
          </Grid>
          <Grid container direction={"column"} alignContent={"center"}>
            <Grid item>
              {textAnnounce && <Typography textAlign={"center"} variant={"h6"} style={{color:"red"}}>{textAnnounce}</Typography>}
            </Grid>
            <Grid item>
              {isNotComfirm && <Button variant="outlined" onClick={moveToConfirmPage}>Click here to move to confirm the user</Button>}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

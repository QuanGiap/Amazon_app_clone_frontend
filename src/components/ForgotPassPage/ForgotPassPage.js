import React, { Component } from "react";
import "./ForgotPassPage.css";
import { Grid, Paper, TextField, Button, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { sendForgotPassCode, checkForgotPassCode } from "../tools/axiosFetch";
const HELPER_TEXT_USER =
  "Type your username here then press \"SEND CODE\" button";
const HELPER_TEXT_CODE = "Confirm code from your email";
const HELPER_TEXT_PASS = "Set up your new password";
const HELPER_TEXT_REPASS = "Type your new password again";
const HELPER_TEXT_ERR_USER = "User name not valid";
const HELPER_TEXT_ERR_CODE = "Confirm code is not correct";
const HELPER_TEXT_ERR_PASS = "Password is not valid";
const HELPER_TEXT_ERR_REPASS = "Password and repassword are not the same";
const SPECIAL_CHAR = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

export default class ForgotPassPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      confirm_code: "",
      password: "",
      retype_password: "",
      text_announce: "",
      is_sended: false,
      is_confirmed: false,
      is_error_username: false,
      is_error_code: false,
      is_error_password: false,
      is_error_repassword: false,
    };
    this.checkValid = this.checkValid.bind(this);
    this.sendCode = this.sendCode.bind(this);
    this.confirmCode = this.confirmCode.bind(this);
  }
  async sendCode() {
    if (this.checkValid({ isForSend: true })) {
      await sendForgotPassCode({ username: this.state.username });
      this.setState({ is_sended: true,text_announce:"Check your email of this username to get code" });
    }
  }
  async confirmCode(){
    this.setState({text_announce:""});
    try{
    if(this.checkValid({isForSend:false})){
      await checkForgotPassCode({username:this.state.username,passsword:this.state.password,code:this.state.confirm_code});
      this.setState({text_announce:"Change password success",is_sended:true});
    }
    }catch(err){
      console.log(err);
      let err_message = "";
      const error_type = err.response?.data?.developer.name;
      if(error_type === "CodeMismatchException"){
        err_message = "Code is not correct";
      }
      else if(error_type === "ExpiredCodeException"){
        err_message = "Code is expired";
      }
      this.setState({is_error_code:true,text_announce: (err_message) ? err_message : err.response?.data?.message || "Error confirm"});
    }
  }
  checkValid({ isForSend = true }) {
    try {
      this.setState({
        is_error_code: false,
        is_error_username: false,
        is_error_password: false,
        is_error_repassword: false,
      });
      if (this.state.username < 5) {
        this.setState({
          is_error_username: true,
          text_announce: "Username missing",
        });
        return false;
      }
      if (isForSend) return true;
      if(!this.state.confirm_code){
        this.setState({
          is_error_code:true,
          text_accounce:"Code missing"
        })
      }
      const err_pass_message = checkPassword({
        password: this.state.password,
        repassword: this.state.retype_password,
      });
      if (err_pass_message === HELPER_TEXT_ERR_REPASS) {
        this.setState({ is_error_repassword: true });
      }
      if (err_pass_message !== "") {
        this.setState({
          is_error_password: true,
          text_announce: err_pass_message,
        });
        return false;
      }
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
  render() {
    const {
      username,
      confirm_code,
      password,
      retype_password,
      text_announce,
      is_sended,
      is_confirmed,
      is_error_username,
      is_error_code,
      is_error_password,
      is_error_repassword,
    } = this.state;
    return (
      <Grid container justifyContent={"center"} alignContent={"center"}>
        <Grid item>
          <Paper className="forgot_pass_container">
            <Grid
              container
              direction={"column"}
              alignContent={"center"}
              spacing={1}
            >
              <Grid item>
                <TextField
                  fullWidth
                  label={"Your Username"}
                  error={is_error_username}
                  helperText={(is_error_username) ? HELPER_TEXT_ERR_USER : HELPER_TEXT_USER}
                  value={username}
                  disabled={is_confirmed}
                  onChange={(e) => this.setState({ username: e.target.value })}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label={"Confirm Code"}
                  error={is_error_code}
                  helperText={(is_error_code) ? HELPER_TEXT_ERR_CODE : HELPER_TEXT_CODE}
                  disabled={!is_sended||is_confirmed}
                  value={confirm_code}
                  onChange={(e) =>
                    this.setState({ confirm_code: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label={"Password"}
                  error={is_error_password}
                  helperText={(is_error_password) ? HELPER_TEXT_ERR_PASS : HELPER_TEXT_PASS}
                  disabled={!is_sended||is_confirmed}
                  value={password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label={"Retype Password"}
                  error={is_error_repassword}
                  helperText={(is_error_repassword) ? HELPER_TEXT_ERR_REPASS : HELPER_TEXT_REPASS}
                  disabled={!is_sended||is_confirmed}
                  value={retype_password}
                  onChange={(e) =>
                    this.setState({ retype_password: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button variant="outlined" disabled={is_confirmed} onClick={this.sendCode}>Send code</Button>
                  </Grid>
                  <Grid item>
                    <Button disabled={!is_sended||is_confirmed} variant="contained" onClick={this.confirmCode}>
                      Confirm change
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                {text_announce && <Typography textAlign={"center"} variant="h6">{text_announce}</Typography>}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
function checkPassword({ password, repassword }) {
  //check password secure
  if (password.length < 12) {
    return "Password is need to be at least 12 chatacter";
  }
  let isLower = false;
  let isUpper = false;
  const isSpecial = SPECIAL_CHAR.test(password);
  let isNumber = false;
  for (let i = 0; i < password.length && !isUpper; i++) {
    const character = password[i];
    const charCode = character.charCodeAt(0);
    if (charCode >= 65 && charCode <= 90) {
      isUpper = true;
    }
  }
  for (let i = 0; i < password.length && !isLower; i++) {
    const character = password[i];
    const charCode = character.charCodeAt(0);
    if (charCode >= 97 && charCode <= 122) {
      isLower = true;
    }
  }
  for (let i = 0; i < password.length && !isNumber; i++) {
    let character = password[i];
    if (!isNaN(character)) {
      isNumber = true;
    }
  }
  if (!isLower) {
    return "Missing lower case character in password";
  }
  if (!isUpper) {
    return "Missing upper case character in password";
  }
  if (!isSpecial) {
    return "Missing special character in password";
  }
  if (!isNumber) {
    return "Missing number character in password";
  }
  if (password !== repassword) {
    return HELPER_TEXT_ERR_REPASS;
  }
  return "";
}

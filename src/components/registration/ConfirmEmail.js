import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { sendCodeVerifyAgain, checkCodeVerify } from "../tools/axiosFetch";
import { useParams, useNavigate } from "react-router-dom";
export default function ConfirmEmail() {
  const { user_name, checkSended } = useParams();
  const nav = useNavigate();
  const [isVerified, setIsVerified] = React.useState(false);
  const [verifycode, setVerifyCode] = React.useState("");
  const [textAnnounce, setTextAnnounce] = React.useState("");
  const [isSended, setSend] = React.useState(false);
  const [isLoad, setLoad] = React.useState(false);
  React.useEffect(() => {
    if(checkSended == "true"){
      setTextAnnounce(
        "Verify code sended in your email. Please type the code in text field"
      );
    }
  }, []);
  const sendVerifyCode = async () => {
    try {
      setLoad(true);
      const res = await sendCodeVerifyAgain({ username: user_name });
      if (res.data.isError) return setTextAnnounce("Code send unsuccess");
      setTextAnnounce(
        "Verify code sended in your email. Please type the code in text field"
      );
    } catch (err) {
      setTextAnnounce(err.response?.data?.message || err.message);
    }
    setLoad(false);
  };

  const verifyCode = async () => {
    try {
      setLoad(true);
      const res = await checkCodeVerify({
        username: user_name,
        verify_code: verifycode,
      });
      if (res.data.isError) return setTextAnnounce("Verify failed, try again");
      setTextAnnounce("Verify successfully");
      setIsVerified(true);
    } catch (err) {
      setTextAnnounce(err.response?.data?.message || err.message);
    }
    setLoad(false);
  };

  return (
    <Paper style={{ margin: "auto", width: "50%", minWidth: "300px" }}>
      <Grid container style={{ padding: "20px" }}>
        <Grid item xs={12} md={6}>
          <TextField
            disabled={isVerified}
            fullWidth
            variant="filled"
            label="Input the verify code"
            value={verifycode}
            onChange={(e) => setVerifyCode(e.target.value)}
          />
        </Grid>
        {!isSended && (
          <Grid item xs={12} md={3}>
            <Button
              disabled={isVerified || isLoad}
              variant="outlined"
              onClick={() => {
                sendVerifyCode();
                setSend(true);
                setTimeout(() => setSend(false), 5000);
              }}
            >
              Send code
            </Button>
          </Grid>
        )}
        <Grid item xs={12} md={3}>
          <Button
            disabled={isVerified || isLoad}
            variant="contained"
            onClick={verifyCode}
          >
            Verify
          </Button>
          {isVerified && <CheckIcon />}
        </Grid>
        {isVerified && (
          <Grid item xs={12} md={3}>
            <Button variant="contained" onClick={() => nav("/sign_in")}>
              Click here to move to login page
            </Button>
          </Grid>
        )}
        {isLoad && <Typography>Loading</Typography>}
        <Grid item xs={12}>
          <Typography>{textAnnounce}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

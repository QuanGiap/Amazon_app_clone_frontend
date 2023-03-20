import React from "react";
import "./RegistrationForm.css";
import {
  Paper,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import AccountSignUp, { checkValidAccount } from "./AccountSignUp";
// import UserInformInput, { checkUserInform } from "./UserInformInput";
import ConfirmEmail from "./ConfirmEmail";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const [isLoad, setLoad] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [textAnnounce, setTextAnnounce] = React.useState();
  // const [firstName, setFirstName] = React.useState("");
  // const [lastName, setLastName] = React.useState("");
  // const [country, setCountry] = React.useState("");
  // const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repassword, setRepassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  // const [codeVerify, setCodeVerify] = React.useState("");
  // const [isVerified, setVerify] = React.useState(false);
  // const [isSended, setSend] = React.useState(false);
  const nav = useNavigate();
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const stepLayout = [
    {
      label: "Create account",
      layOut: (
        <AccountSignUp
          username={username}
          email={email}
          password={password}
          repassword={repassword}
          setUsername={(text) => setUsername(text)}
          setEmail={(text) => setEmail(text)}
          setPassword={(text) => setPassword(text)}
          setRepassword={(text) => setRepassword(text)}
        />
      ),
      checkFunction: async () =>
        checkValidAccount(
          email,
          username,
          password,
          repassword,
          setTextAnnounce
        ),
    },
    // {
    //   label: "Some of your info",
    //   layOut: (
    //     <UserInformInput
    //       email={email}
    //       firstName={firstName}
    //       lastName={lastName}
    //       country={country}
    //       phoneNumber={phoneNumber}
    //       setFirstName={(text) => setFirstName(text)}
    //       setLastName={(text) => setLastName(text)}
    //       setCountry={(text) => setCountry(text)}
    //       setPhoneNumber={(text) => setPhoneNumber(text)}
    //     />
    //   ),
    //   checkFunction: async () =>
    //     checkUserInform(
    //       email,
    //       password,
    //       firstName,
    //       lastName,
    //       country,
    //       phoneNumber,
    //       setTextAnnounce
    //     ),
    // },
    // {
    //   label:"Confirm your email",
    //   layOut: (
    //     <ConfirmEmail
    //       email={email}
    //       username={username}
    //       password={password}
    //       isVerified={isVerified}
    //       setVerify={setVerify}
    //       codeVerify={codeVerify}
    //       setCodeVerify={setCodeVerify}
    //       isSended={isSended}
    //       setSend={() => {
    //         setSend(true);
    //         setTimeout(() => setSend(false), 5000);
    //       }}
    //       setTextAnnounce={setTextAnnounce}
    //     />
    //   ),
    //   checkFunction: () => {
    //     if (!isVerified) {
    //       setTextAnnounce("Please verify first");
    //     } else setTextAnnounce("");
    //     return isVerified;
    //   },
    // },
  ];

  const isStepOptional = (step) => {
    //currently not ava
    return step === -1;
  };

  const handleNext = async (check) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setLoad(true);
    setTextAnnounce("");
    const isValid = (await check?.()) || false;
    setLoad(false);
    if (!isValid) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item xs={6}>
        <Paper elevation={3} className="registration-form">
          <Stepper activeStep={activeStep}>
            {stepLayout.map(({ label }, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === stepLayout.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Sign up completed - You need to confirm your email
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={() => nav("/confirm_code/" + username+"/true")}>
                  Go to Confirm page
                </Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {stepLayout[activeStep].layOut}
              <Typography className="registration-text-error">
                {textAnnounce}
              </Typography>
              {isLoad && (
                <Typography className="registration-text-error">
                  Loading...
                </Typography>
              )}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button
                  onClick={() =>
                    handleNext(stepLayout[activeStep].checkFunction)
                  }
                >
                  {activeStep === stepLayout.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

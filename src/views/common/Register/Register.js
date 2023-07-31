/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import logoImage from "../../../assets/logo.png";
import registerImage from "../../../assets/register.png";
import { notify } from "components";
import { DeviceInfoContext } from "contexts/index";
import { API } from "helpers/index";
import MyAlgoConnect from "@randlabs/myalgo-connect";
const myAlgoWallet = new MyAlgoConnect();
const myAlgoWalletSettings = {
  shouldSelectOneAccount: true,
  openManager: false,
};
const logicSigBase64 = "BTEQgQQSMRQxABIQMRKBABIQRIEBQw==";

export const Register = () => {
  const { deviceData } = useContext(DeviceInfoContext);
  const [pageHeading] = useState("Register");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [logicSignature, setLogicSignature] = useState(null);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    const userData = {
      deviceData,
      emailId,
      password,
      firstName,
      lastName,
      accountAddress,
      logicSignature,
    };

    const response = await API.register(userData);
    if (response.success) {
      notify("Registered Successfully");
      navigate("/login");
    }
  };
  const validationCheck = () => {
    if (
      emailId.length < 0 ||
      password.length < 0 ||
      confirmPassword.length < 0 ||
      firstName.length < 0 ||
      lastName.length < 0 ||
      accountAddress.length < 0 ||
      emailId === "" ||
      password === "" ||
      confirmPassword === "" ||
      firstName === "" ||
      lastName === "" ||
      accountAddress === ""
    ) {
      return notify("Please fill in all the details.");
    }
    let emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailPatternTest = emailPattern.test(emailId);
    if (!emailPatternTest) {
      notify("Email not in proper format");
    }
    if (password !== confirmPassword) {
      return notify("Passwords don't match.");
    }
    if (logicSignature === null) {
      return notify("Please Connect and Sign into Logic Signature");
    }
    if (emailPatternTest) {
      if (checked) {
        return register();
      } else {
        alert("Please tick the Terms and Conditions to register");
      }
    }
  };

  // HANDLE WALLET CONNECT
  const handleConnectWalletClick = () => {
    myAlgoWallet
      .connect(myAlgoWalletSettings)
      .then((account) => {
        setAccountAddress(account[0].address);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signLogicSig = () => {
    myAlgoWallet
      .signLogicSig(logicSigBase64, accountAddress)
      .then(async (signedLogicSigFromWallet) => {
        let data = { signedLogicSig: Array.from(signedLogicSigFromWallet) };
        setLogicSignature(data.signedLogicSig);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let form = (
    <form noValidate>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="firstName"
        label="First Name"
        name="firstName"
        autoComplete="email"
        onChange={(e) => setFirstName(e.target.value)}
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        name="lastName"
        autoComplete="email"
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        onChange={(e) => setEmailId(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="current-password"
      />

      <Box sx={{ mt: 2 }}>
        {accountAddress ? (
          <Button size="middle" variant="contained" onClick={signLogicSig}>
            {"Sign MyAlgo Wallet"}
          </Button>
        ) : (
          <Button
            size="middle"
            variant="contained"
            onClick={handleConnectWalletClick}
          >
            {"Connect MyAlgo Wallet"}
          </Button>
        )}
      </Box>
      <Box sx={{ my: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
            />
          }
          label={
            <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
              Please confirm terms and conditions to allow control on your
              behalf.
            </Typography>
          }
        />
      </Box>

      <Box sx={{ mt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={validationCheck}
        >
          Register
        </Button>
      </Box>
    </form>
  );
  let content = (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box
        component="img"
        src={logoImage}
        alt="Image Not Found"
        style={{
          width: "152px",
          height: "32px",
          marginTop: "30px",
          marginLeft: "53px",
        }}
      />

      <Box
        component="img"
        src={registerImage}
        alt="Welcome Image"
        style={{
          position: "absolute", // Position the image absolutely
          top: 0, // Align the image to the top of the container
          right: 0, // Align the image to the right of the container
          height: "100%",
          width: "50%", // Make sure the image takes the full height of the container
        }}
      />
      {form}
    </Box>
  );
  return content;
};

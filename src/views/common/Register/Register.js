/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Typography,
  Button,
  Box,
  InputLabel,
  styled,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import logoImage from "../../../assets/logo.png";
import authImage from "../../../assets/register.png";
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
  const [ethereumAddress, setEthereumAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    const userData = {
      deviceData,
      emailId,
      password,
      firstName,
      lastName
    };

    if (ethereumAddress !== "") {
      userData.ethereumAddress = ethereumAddress;
    }

    if (accountAddress !== "" && logicSignature !== null) {
      userData.accountAddress = accountAddress;
      userData.logicSignature = logicSignature;
    }

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
      emailId === "" ||
      password === "" ||
      confirmPassword === "" ||
      firstName === "" ||
      lastName === "" ||
      ((accountAddress === "" || accountAddress.length < 0) && ethereumAddress === "")
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
    if (logicSignature === null && ethereumAddress === "") {
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
  const handleConnectEthereumClick = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
    setEthereumAddress(accounts[0]);
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
    <form
      noValidate
      style={{
        maxHeight: "90%",
        overflowY: "hidden",
        maxWidth: "80%",
        marginLeft: "9%",
      }}
      autoComplete="off"
    >
      <InputLabel htmlFor="firstname">First Name</InputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="firstname"
        name="firstname"
        autoComplete="off"
        onChange={(e) => setFirstName(e.target.value)}
        autoFocus
        size="small"
      />

      <InputLabel htmlFor="lastname">Last Name</InputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="lastname"
        name="lastname"
        autoComplete="off"
        onChange={(e) => setLastName(e.target.value)}
      />

      <InputLabel htmlFor="email">Email</InputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        name="email"
        autoComplete="off"
        onChange={(e) => setEmailId(e.target.value)}
      />

      <InputLabel htmlFor="password">Password</InputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password"
        type="password"
        name="password"
        autoComplete="off"
        onChange={(e) => setPassword(e.target.value)}
      />

      <InputLabel htmlFor="confirmpassword">Confirm Password</InputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="confirmpassword"
        name="confirmpassword"
        autoComplete="off"
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
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

      <Box sx={{ mt: 2 }}>
        {typeof window.ethereum !== 'undefined' && ethereumAddress.length === 0 ? (
          <Button size="middle" variant="contained" onClick={handleConnectEthereumClick}>
            {"Connect Ethereum Account"}
          </Button>
        ) : typeof window.ethereum !== 'undefined' && ethereumAddress.length !== 0 ? (
          <Button
            disabled={true}
            size="middle"
            variant="contained"
            onClick={handleConnectEthereumClick}
            sx={{
              "&.Mui-disabled": {
                color: "grey"
              }
            }}
          >
            {"Ethereum Account Connected"}
          </Button>
        ) : (<></>)}
      </Box>

      <Box sx={{ my: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              color="default"
            />
          }
          label={
            <Typography
              sx={{ fontSize: 12, fontWeight: "bold", color: "white" }}
            >
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
        minHeight: "100vh",
      }}
    >
      {/* Left-side container for logo and form */}
      <Box sx={{ flex: 1, padding: "20px" }}>
        <Box
          component="img"
          src={logoImage}
          alt="Image Not Found"
          style={{
            width: "152px",
            height: "30px",
          }}
        />

        <Typography
          variant="h5"
          style={{ marginBottom: "5%", marginTop: "2%", marginLeft: "9%" }}
        >
          Welcome to Blocconi<br></br>
          Create User to Continue
        </Typography>

        {/* Form */}
        {form}

        <Typography
          sx={{
            textAlign: "center",
            color: "white",
            mt: "20px",
            fontSize: "12px",
          }}
        >
          Already a member?{" "}
          <strong>
            <Link
              to="/login"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Login Now
            </Link>
          </strong>
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          maxHeight: "100%",
          maxWidth: "150%",
        }}
      >
        <Box
          component="img"
          src={authImage}
          alt="Welcome Image"
          style={{
            maxHeight: "100%",
            width: "680px",
            overflow: "hidden",
          }}
        />
      </Box>
    </Box>
  );

  return content;
};

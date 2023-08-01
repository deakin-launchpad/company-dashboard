/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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

  const inputStyles = {
    height: "30px",
    borderRadius: "2px",
    marginTop: "-3%",
    fontSize: "12px",
    backgroundColor: "#162A3C",
  };

  const CustomInputLabel = styled(InputLabel)({
    fontSize: "12px",
    color: "white",
    fontWeight: "300",
  });

  let form = (
    <form
      noValidate
      style={{
        maxHeight: "90%",
        overflowY: "hidden",
        maxWidth: "80%",
        marginLeft: "9%",
      }}
    >
      <CustomInputLabel htmlFor="firstname">First Name</CustomInputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="firstname"
        name="firstname"
        autoComplete="firstname"
        onChange={(e) => setFirstName(e.target.value)}
        autoFocus
        size="small"
        InputProps={{ style: inputStyles }}
      />

      <CustomInputLabel htmlFor="lastname">Last Name</CustomInputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="lastname"
        name="lastname"
        autoComplete="lastname"
        onChange={(e) => setLastName(e.target.value)}
        InputProps={{ style: inputStyles }}
      />

      <CustomInputLabel htmlFor="email">Email</CustomInputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        name="email"
        autoComplete="email"
        onChange={(e) => setEmailId(e.target.value)}
        InputProps={{ style: inputStyles }}
      />

      <CustomInputLabel htmlFor="password">Password</CustomInputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="password"
        type="password"
        name="password"
        autoComplete="password"
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{ style: inputStyles }}
      />

      <CustomInputLabel htmlFor="confirmpassword">
        Account Address
      </CustomInputLabel>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="confirmpassword"
        name="confirmpassword"
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        InputProps={{ style: inputStyles }}
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
            style={{
              backgroundColor: "#0D539B",
              typography: {
                fontFamily: "Roboto, sans-serif",
              },
            }}
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
          sx={{
            marginTop: "20px",
            width: "100%",
            height: "27px",
            borderRadius: "8px",
            backgroundColor: "#0D539B",
            typography: {
              fontFamily: "Roboto, sans-serif",
            },
          }}
          onClick={validationCheck}
        >
          Create &gt;
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

/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Typography,
  Button,
  Box,
  Divider,
  Container,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { notify } from "components";
import { Link as RouterLink } from "react-router-dom";
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
      return register();
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
      <Box sx={{ mt: 2 }}>
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
      <Container maxWidth="sm" sx={{ py: "80px" }}>
        <Card>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 4,
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography color="textPrimary" gutterBottom variant="h4">
                  {pageHeading}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  Register for the Company Platform
                </Typography>
              </div>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 1,
              }}
            >
              {form}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Link
              color="textSecondary"
              component={RouterLink}
              to="/login"
              variant="body2"
            >
              Have an account?
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
  return content;
};

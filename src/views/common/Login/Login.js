import { /*useState*/ useContext, useCallback } from "react";
import {
  Typography,
  Box,
  // Container,
  // Card,
  // CardContent,
  // Divider,
  // Link,
} from "@mui/material";

import { LoginContext, DeviceInfoContext, LayoutContext } from "contexts";
import { LoginForm /*SsoLogin*/ } from "components";
import { API } from "helpers";
import { ConnectionConfig } from "constants/index";
import { Link } from "react-router-dom";
import authImage from "../../../assets/register.png";
import logoImage from "../../../assets/logo.png";
export const Login = () => {
  // const [pageHeading] = useState("Login");

  const { setAccessToken } = useContext(LoginContext);
  const { deviceUUID, deviceName } = useContext(DeviceInfoContext);
  const { setCurrentUserRole } = useContext(LayoutContext);

  const performLogin = useCallback(
    async (loginValues) => {
      if (ConnectionConfig.bypassBackend) {
        setAccessToken("dummyToken");
      } else {
        let details = {
          ...loginValues,
          deviceData: {
            deviceType: "WEB",
            deviceName: deviceName,
            deviceUUID: deviceUUID,
          },
        };
        return API.login(details);
      }
    },
    [setAccessToken, deviceUUID, deviceName]
  );

  const getUserRole = useCallback(async () => {
    const response = await API.getUserRole();
    if (response.success) {
      setCurrentUserRole(response.data);
      return true;
    } else return false;
  }, [setCurrentUserRole]);

  const firebaseToken = useCallback(async (data) => {
    const response = await API.refreshFirebaseMessageToken(data);
    if (response.success) {
      return true;
    } else return false;
  }, []);

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
          Login to Continue
        </Typography>

        <LoginForm
          login={performLogin}
          onSuccess={getUserRole}
          token={firebaseToken}
        />

        <Typography
          sx={{
            textAlign: "center",
            color: "#ffffff",
            fontSize: "12px",
            mt: "20px",
          }}
        >
          Not a member?{" "}
          <strong>
            <Link
              to="/register"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Register Now
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

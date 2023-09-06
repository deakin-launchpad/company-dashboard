/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import { notify } from "components/index";
import { API } from "helpers/index";
import HomeImage from "../../../assets/home.png";

export const Home = () => {
  const theme = useTheme();
  const [user, setUser] = useState([]);

  const getUser = useCallback(async () => {
    const response = await API.getUserProfile();
    if (response.success) {
      const res = response.data.customerData;
      setUser(res);
      // console.log(user);
    } else {
      setUser([]);
      notify("Failed to Fetch User Profile");
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "93%",
          height: "90%",
          overflowY: "hidden",
          backgroundColor: theme.palette.background.secondary,
          position: "absolute", // Add this line
          top: "50%",
          borderRadius: "5px",
          bottom: "50%", // Add this line
          left: "50%", // Add this line
          transform: "translate(-50%, -50%)", // Add this line
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute", // Add this line
            top: "50%", // Add this line
            left: "50%", // Add this line
            transform: "translate(-50%, -50%)", // Add this line
          }}
        >
          <img
            src={HomeImage}
            alt="Your Image"
            style={{ width: "150px", height: "170px", marginBottom: "20px" }}
          />
          <Typography
            variant="h6"
            color="white"
            sx={{ fontWeight: "800", mb: "2px" }}
          >
            Please create a company now!
          </Typography>
          <Typography
            variant="body2"
            //color="textSecondary"
            sx={{ fontSize: "12px" }}
          >
            Create a company in just a few minutes
          </Typography>

          {(() => {
            if ("accountAddress" in user && "logicSignature" in user && user.logicSignature.length > 0) {
              return (
                <Link to="/createAlgoCompany" style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: "30px",
                      width: "100%",
                      height: "27px",
                    }}

                  >
                    Create Now on Algorand &gt;
                  </Button>
                </Link>
              );
            }
          })()}



          {(() => {
            if ("ethereumAddress" in user) {
              return (
                <Link to="/createEthCompany" style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: "30px",
                      width: "100%",
                      height: "27px",
                    }}

                  >
                    Create Now on Ethereum &gt;
                  </Button>
                </Link>
              );
            }
          })()}

        </Box>
      </Box>
    </Box>
  );
};
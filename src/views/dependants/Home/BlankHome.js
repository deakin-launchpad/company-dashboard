import { Link } from 'react-router-dom';
import { Box, Button, Typography } from "@mui/material";
import HomeImage from "../../../assets/home.png";
import PropTypes from "prop-types";

export const BlankHome = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
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
        if ("accountAddress" in props.user && "logicSignature" in props.user && props.user.logicSignature.length > 0) {
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
        if ("ethereumAddress" in props.user) {
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
  );
};

BlankHome.propTypes = {
  user: PropTypes.any.isRequired,
};

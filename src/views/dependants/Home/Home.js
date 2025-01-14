/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, } from "@mui/material";
import { Link } from 'react-router-dom';
import { EnhancedModal, notify } from "components/index";
import { API } from "helpers/index";
import { BlankHome } from "./BlankHome";
import { CompaniesList } from "./CompaniesList";

export const Home = () => {
  const theme = useTheme();
  const [companies, setCompanies] = useState([]);
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);

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

  const getUserCompanies = useCallback(async () => {
    const response = await API.getUserCompanies();
    if (response.success) {
      const res = response.data;
      setCompanies(res);
      // console.log(companies);
    } else {
      setCompanies([]);
      notify("Failed to Fetch User Companies");
    }
  }, []);

  useEffect(() => {
    getUserCompanies();
    getUser();
  }, [getUserCompanies, getUser]);

  let createOptions = (
    <Box>
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
                Algorand &gt;
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
                Ethereum &gt;
              </Button>
            </Link>
          );
        }
      })()}
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "100px",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        {companies?.length > 0 ? (<Button onClick={() => setOpen(true)} >Create One +</Button>) : null}
      </Box>

      <Box
        sx={{
          width: "93%",
          height: "90%",
          backgroundColor: theme.palette.background.secondary,
          borderRadius: "5px",
          margin: "auto",

        }}
      >
        {
          companies?.length === 0 ? (
            <BlankHome user={user} />
          ) : (
            <CompaniesList companies={companies} />
          )
        }

        <EnhancedModal
          isOpen={open}
          dialogTitle={`Create A Company On...`}
          dialogContent={createOptions}
          options={{
            onClose: () => setOpen(false),
            disableSubmit: true,
          }}
        />

      </Box>
    </Box>
  );
};
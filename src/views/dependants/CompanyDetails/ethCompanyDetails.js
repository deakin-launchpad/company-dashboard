import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useParams, } from 'react-router-dom';
import companyABI from '../../../ABI/Company.json';
import { web3 } from '../../../helpers/index';


export const EthCompanyDetails = () => {
  const theme = useTheme();
  const { appId } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [companyCoins, setCompanyCoins] = useState("");
  const [companyShares, setCompanyShares] = useState("");
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [founders, setFounders] = useState([]);

  const DECIMALS = Math.pow(10, 18);

  useEffect(() => {
    let accounts = [];

    const eth = window.ethereum;
    eth.request({ method: 'eth_requestAccounts', params: [] })
      .then((_accounts) => {
        accounts = _accounts;
      })
      .catch((error) => console.error(error));

    const companyContract = new web3.eth.Contract(companyABI, appId);

    console.log(companyContract.methods);

    companyContract.methods.companyName().call({ from: accounts[0] }).then((result) => {
      setCompanyName(result);
    }).catch((error) => {
      console.error(error);
    });

    companyContract.methods.coins().call({ from: accounts[0] }).then((result) => {
      setCompanyCoins(result);
    }).catch((error) => {
      console.error(error);
    });

    companyContract.methods.shares().call({ from: accounts[0] }).then((result) => {
      setCompanyShares(result);
    }).catch((error) => {
      console.error(error);
    });

    companyContract.methods.getTotalCoins().call({ from: accounts[0] }).then((result) => {
      setTotalCoins(result);
    }).catch((error) => {
      console.error(error);
    });

    companyContract.methods.getTotalShares().call({ from: accounts[0] }).then((result) => {
      setTotalShares(result);
    }).catch((error) => {
      console.error(error);
    });

    // TODO: Check again! Implemented but not working
    companyContract.methods.getFounders().call({ from: accounts[0] }).then((result) => {
      setFounders(result);
    }).catch((error) => {
      console.error(error);
    });
  }, [appId]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Company Smart Contract Address:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {appId}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Company Name:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {companyName}
          </Typography>
        </Grid>
        {founders.map((founder, index) => {
          return (
            <React.Fragment key={index}>
              <Grid item xs={3}>
                <Typography variant="body1" color="white">
                  Founder {index + 1}:
                </Typography>
              </Grid>
              <Grid item xs={9} >
                <Typography variant="body1" color="white">
                  {founder}
                </Typography>
              </Grid>
            </React.Fragment>
          );
        })}
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Coins Address:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {companyCoins}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Coins Total Supply:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {totalCoins / DECIMALS}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Shares Address:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {companyShares}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Shares Total Supply:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {totalShares / DECIMALS}
          </Typography>
        </Grid>
      </Grid>
      <Button href={`https://sepolia.etherscan.io/address/${appId}`} target="_blank" sx={{ mt: 5 }}>
        Explore Smart Contract on EtherScan
      </Button>
    </Box>
  );
};
import React, { useState, useCallback, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import algosdk from 'algosdk';

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);


export const AlgoCompanyDetails = () => {
  const theme = useTheme();
  const { appId } = useParams();
  const [scRawDetails, setRawScDetails] = useState([]);
  const [creatorAddress, setCreatorAddress] = useState('');

  const sortScDetails = (scDetails) => {
    const sortedData = scDetails.sort((a, b) => {
      const keyA = atob(a.key); // Decoding base64 key to compare
      const keyB = atob(b.key); // Decoding base64 key to compare

      // Compare the decoded keys
      if (keyA < keyB) {
        return -1;
      }
      if (keyA > keyB) {
        return 1;
      }
      return 0;
    });
    return sortedData;
  };

  const getContractDetails = useCallback(async () => {
    try {
      const scDetails = await algod.getApplicationByID(appId).do();
      console.log(scDetails.params);
      if (scDetails?.params['global-state']?.length > 0) {
        const sortedScDetails = sortScDetails(scDetails.params['global-state']);
        setRawScDetails(sortedScDetails);
        setCreatorAddress(scDetails.params.creator);
      } else {
        setRawScDetails([]);
      }
    } catch (e) {
      console.error('There was an error connecting to the algorand node: ', e);
    }
  }, [appId]);

  useEffect(() => {
    getContractDetails();
  }, [getContractDetails]);

  const bytesToAddress = (rawBytesAddress) => {
    const bytes = Buffer.from(rawBytesAddress, 'base64');
    const address = algosdk.encodeAddress(bytes);
    return address;
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        overflowY: "auto",
        position: "relative",
        padding: theme.spacing(2), // Adding some padding for better spacing
      }}
    >

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Creator&apos;s address:
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body1" color="white">
            {creatorAddress}
          </Typography>
        </Grid>
        {scRawDetails.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <Grid item xs={3}>
                <Typography variant="body1" color="white">
                  {atob(item.key)}:
                </Typography>
              </Grid>
              <Grid item xs={9} >

                <Typography variant="body1" color="white">
                  {item.value.type === 2 ? item.value.uint : null}
                  {item.value.type === 1 ?
                    atob(item.key) !== "company_name" ?
                      bytesToAddress(item.value.bytes) :
                      atob(item.value.bytes) :
                    null}
                </Typography>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
      <Button href={`https://testnet.algoexplorer.io/application/${appId}`} target="_blank" sx={{ mt: 5 }}>
        Explore Smart Contract on AlgoExplorer
      </Button>
    </Box>
  );
};
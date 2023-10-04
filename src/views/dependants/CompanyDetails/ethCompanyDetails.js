/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useParams, Link } from 'react-router-dom';
import companyABI from '../../../ABI/Company.json';
import { web3 } from '../../../helpers/index';


export const EthCompanyDetails = () => {
  const theme = useTheme();
  const { appId } = useParams();

  useEffect(() => {
    // let accounts = [];
    // web3.eth.getAccounts().then((_accounts) => {
    //   accounts = _accounts;
    // });

    // const contract = new web3.eth.Contract(companyABI, appId, {
    //   from: accounts[0],
    //   gas: 1500000,
    //   gasPrice: '20000000000'
    // });

    // console.log(accounts);
    // console.log(contract);
  });

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      Test {appId}
    </Box>
  );
};
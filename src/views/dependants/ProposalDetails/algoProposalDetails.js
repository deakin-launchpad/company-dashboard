/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useParams, } from 'react-router-dom';
import { API } from "helpers/index";
import { notify } from 'components';
import { format } from 'date-fns';

export const AlgoProposalDetails = () => {
  const theme = useTheme();
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState();

  const getProposal = useCallback(async () => {
    const response = await API.getProposalById(proposalId);

    if (response.success) {
      const res = response.data[0];
      res.ideationCloseTime = format(new Date(res.ideationCloseTime), 'EEEE, MMMM d, yyyy hh:mm a');
      res.votingCloseTime = format(new Date(res.votingCloseTime), 'EEEE, MMMM d, yyyy hh:mm a');
      setProposal(res);
    } else {
      setProposal({});
      notify("Failed to Fetch Proposal Details");
    }
  }, [proposalId]);

  useEffect(() => {
    getProposal();
  }, [getProposal]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {/* <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Company Smart Contract Address:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {appId}
          </Typography>
        </Grid> */}
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Proposal Title:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {proposal?.name}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Description:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {proposal?.description}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Phase:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {proposal?.phase}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            App ID:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {proposal?.appId ?? "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Ideation closes at:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {proposal?.ideationCloseTime}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Voting closes at:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {proposal?.votingCloseTime}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1" color="white">
            Governance Token:
          </Typography>
        </Grid>
        <Grid item xs={9} >
          <Typography variant="body1" color="white">
            {proposal?.governanceToken}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {proposal?.ideas?.map((idea) => {
          return (
            <Button key={idea._id} sx={{ mt: 2, width: "60%" }}>
              {idea.name}
            </Button>
          );
        })}
      </Box>

      {/* <Button href={`https://sepolia.etherscan.io/address/${appId}`} target="_blank" sx={{ mt: 5 }}>
        Explore Smart Contract on EtherScan
      </Button> */}
    </Box>
  );
};
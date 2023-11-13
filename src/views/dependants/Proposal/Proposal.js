import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, } from "@mui/material";
// import { Link } from 'react-router-dom';
import { EnhancedModal, notify } from "components/index";
import { API } from "helpers/index";
import { ProposalCard } from 'components/index';


export const Proposal = () => {
  const theme = useTheme();
  const [proposals, setProposals] = useState([]);
  const [open, setOpen] = useState(false);

  const getProposals = useCallback(async () => {
    const response = await API.getProposals();
    if (response.success) {
      const res = response.data;
      setProposals(res);
    } else {
      setProposals([]);
      notify("Failed to Fetch User Companies");
    }
  }, []);

  useEffect(() => {
    getProposals();
  }, [getProposals]);

  let createOptions = (
    <Box>

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
        {proposals?.length > 0 ? (<Button onClick={() => setOpen(true)} >Create Proposal +</Button>) : null}
      </Box>

      <Box
        sx={{
          width: "93%",
          height: "90%",
          borderRadius: "5px",
          margin: "auto",

        }}
      >
        {
          proposals.map((proposal) => {
            return (
              <ProposalCard proposal={proposal} key={proposal._id} />
            );
          })
        }

        <EnhancedModal
          isOpen={open}
          dialogTitle={`Create A Proposal`}
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
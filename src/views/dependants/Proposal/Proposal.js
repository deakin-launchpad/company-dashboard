import { useState, useCallback, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/styles";
import { Box, Button, TextField } from "@mui/material";
import { EnhancedModal, notify } from "components/index";
import { API } from "helpers/index";
import { ProposalCard } from 'components/index';

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

export const Proposal = () => {
  const theme = useTheme();
  const [proposals, setProposals] = useState([]);
  const [open, setOpen] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    // This function gets called when the component is mounted
    // and before the component gets unmounted
    return () => {
      // Component will unmount
      isMounted.current = false;
    };
  }, []);

  const getProposals = useCallback(async () => {
    const response = await API.getProposals();
    if (isMounted.current) {

      if (response.success) {
        const res = response.data;
        setProposals(res);
      } else {
        setProposals([]);
        notify("Failed to Fetch User Companies");
      }
    }
  }, []);

  useEffect(() => {
    getProposals();
  }, [getProposals]);

  const initialValues = {
    proposalName: "",
    proposalDescription: "",
    proposalVideo: "",
    proposalSlides: "",
    funds: 0,
    ideationCloseTime: "2000-01-01 00:00:00",
    votingCloseTime: "2000-01-01 00:00:00",
    governanceToken: "",
    minTokenAmount: 1,
    numberOfChoices: 1
  };

  const validationSchema = () => {
    return Yup.object().shape({
      proposalName: Yup.string()
        .max(255)
        .required("Proposal Name is required"),
      proposalDescription: Yup.string()
        .max(50)
        .required("Proposal Description is required"),
      proposalSlides: Yup.string()
        .max(50)
        .optional(),
      proposalVideo: Yup.string()
        .max(50)
        .optional(),
      funds: Yup.number()
        .min(0)
        .required("Funds is required"),
      ideationCloseTime: Yup.string()
        .max(50)
        .required("Ideation phase close time is required"),
      votingCloseTime: Yup.string()
        .max(50)
        .required("Voting phase close time is required"),
      governanceToken: Yup.string()
        .required("Governance token ID is required"),
      minTokenAmount: Yup.number()
        .min(1)
        .integer()
        .required("Minimum token amount is required"),
      numberOfChoices: Yup.number()
        .min(1)
        .integer()
        .required("Number of choices is required"),
    });
  };

  //TextField styles
  const CustomField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1B3347",
      height: "30px",
      borderRadius: "8px",
      fontSize: "12px",
      borderColor: "#1B3347",
      border: "2px solid",
      marginTop: "18px",
      width: "px",
    },
  });

  //Input Label style
  const InputLabelStyle = {
    shrink: true,
    disableAnimation: true,
    style: {
      color: "white",
      fontSize: "20px",
      fontWeight: "400",
      borderBottom: "black",
      marginLeft: "-10px",
      fontFamily: "Roboto",
    },
  };

  const handleSubmit = async (values) => {
    const result = await API.createProposal(values);
    if (result.success) {
      notify("Proposal Created Successfully");
      setOpen(false);
      getProposals();
    } else {
      notify("Failed to Create Proposal");
    }
  };

  let createOptions = (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form style={{ marginTop: "10px" }}>
            <Box sx={{ ml: "30px", mr: "30px" }}>
              <Field
                fullWidth
                as={CustomField}
                autoComplete="off"
                label="Proposal Name"
                margin="normal"
                name="proposalName"
                type="text"
                variant="outlined"
                error={touched.proposalName && Boolean(errors.proposalName)}
                helperText={touched.proposalName && errors.proposalName}
                InputLabelProps={InputLabelStyle}
              />
              <Field
                fullWidth
                as={CustomField}
                autoComplete="off"
                label="Shorst description"
                margin="normal"
                name="proposalDescription"
                type="text"
                variant="outlined"
                maxlines={3}
                error={touched.proposalDescription && Boolean(errors.proposalDescription)}
                helperText={touched.proposalDescription && errors.proposalDescription}
                InputLabelProps={InputLabelStyle}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "46% 46%",
                gridRow: "auto auto",
                justifyContent: "space-between",
                ml: "30px",
                mr: "30px",
              }}
            >
              <Field
                as={CustomField}
                autoComplete="off"
                label="Slides"
                margin="normal"
                name="proposalSlides"
                type="text"
                variant="outlined"
                error={touched.proposalSlides && Boolean(errors.proposalSlides)}
                helperText={touched.proposalSlides && errors.proposalSlides}
                InputLabelProps={InputLabelStyle}
              />
              <Field
                as={CustomField}
                autoComplete="off"
                label="Video"
                margin="normal"
                name="proposalVideo"
                type="text"
                variant="outlined"
                error={touched.proposalVideo && Boolean(errors.proposalVideo)}
                helperText={touched.proposalVideo && errors.proposalVideo}
                InputLabelProps={InputLabelStyle}
              />
              <Field
                as={CustomField}
                label="Funds"
                fullWidth
                margin="normal"
                name="funds"
                type="text"
                variant="outlined"
                error={touched.funds && Boolean(errors.funds)}
                helperText={touched.funds && errors.funds}
                InputLabelProps={InputLabelStyle}
              />
              <Field
                as={CustomField}
                label="Governance Token"
                margin="normal"
                name="governanceToken"
                type="text"
                variant="outlined"
                error={touched.governanceToken && Boolean(errors.governanceToken)}
                helperText={touched.governanceToken && errors.governanceToken}
                InputLabelProps={InputLabelStyle}
              />
              <Field
                fullWidth
                as={CustomField}
                autoComplete="off"
                label="Minimum Token Number"
                margin="normal"
                name="minTokenAmount"
                type="number"
                variant="outlined"
                error={touched.minTokenAmount && Boolean(errors.minTokenAmount)}
                helperText={touched.minTokenAmount && errors.minTokenAmount}
                InputLabelProps={InputLabelStyle}
              />
              <Field
                as={CustomField}
                autoComplete="off"
                label="Number of Choices"
                margin="normal"
                name="numberOfChoices"
                type="number"
                variant="outlined"
                error={touched.numberOfChoices && Boolean(errors.numberOfChoices)}
                helperText={touched.numberOfChoices && errors.numberOfChoices}
                InputLabelProps={InputLabelStyle}
              />

              <Field
                as={CustomField}
                autoComplete="off"
                label="Ideation Close Time"
                margin="normal"
                name="ideationCloseTime"
                type="text"
                variant="outlined"
                error={touched.ideationCloseTime && Boolean(errors.ideationCloseTime)}
                helperText={touched.ideationCloseTime && errors.ideationCloseTime}
                InputLabelProps={InputLabelStyle}
              />
              <Field
                as={CustomField}
                autoComplete="off"
                label="Voting Close Time"
                margin="normal"
                name="votingCloseTime"
                type="text"
                variant="outlined"
                error={touched.votingCloseTime && Boolean(errors.votingCloseTime)}
                helperText={touched.votingCloseTime && errors.votingCloseTime}
                InputLabelProps={InputLabelStyle}
              />
            </Box>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                size="large"
                variant="contained"
                type="submit"
              >
                Create Proposal
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
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
          dialogTitle={`Create New Proposal`}
          dialogContent={createOptions}
          options={{
            onClose: () => setOpen(false),
            disableSubmit: true,
            disableClose: true,
          }}
        />
      </Box>
    </Box>
  );
};
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Box, Container, Button, TextField } from "@mui/material";
import { LayoutConfig } from "constants/index";
import { EnhancedModal } from "components/index";
import * as Yup from "yup";
import { Formik, Form, Field, FieldArray } from "formik";
import { API } from "helpers/index";
import { onMessageListener } from "firebase";
import { Typography } from "../../../../node_modules/@mui/material/index";

export const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationData, setNotificationData] = useState([]);

  onMessageListener()
    .then((payload) => {
      setNotificationData(payload.notification.body.split(","));
      setOpen(true);
      console.log("payload", payload);
    })
    .catch((err) => console.log("failed: ", err));

  const initialValues = {
    name: "",
    founders: "",
    directors: "",
    founderAmountOfShares: "",
    directorAmountOfShares: "",
    admins: "",
    shareCountName: "",
    shareCount: "",
    stablecoinName: "",
    stablecoinCount: "",
    decimalShares: "",
    decimalCoins: "",
  };

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().max(255).required("Company Name Is Required"),
      founders: Yup.array()
        .required("Founders must be added")
        .test("Email Exists", async function (value) {
          return await API.doesUserExist(value)
            .then((response) => {
              return response.data.exists;
            })
            .catch((error) => {
              return error;
            });
        }),
      directors: Yup.array(),
      admins: Yup.array(),
      shareCount: Yup.number()
        .positive()
        .integer()
        .required("Share count must be added"),
      stablecoinCount: Yup.number()
        .positive()
        .integer()
        .required("Stablecoin count must be added"),
      decimalShares: Yup.number()
        .positive()
        .integer()
        .required("Decimal is required"),
      decimalCoins: Yup.number()
        .positive()
        .integer()
        .required("Decimal is required"),
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    // Create JSON for FOUNDERS, ADMINS, DIRECTORS
    let founders = [];
    let admins = [];
    let directors = [];
    for (let i = 0; i < values.founders.length; i++) {
      founders.push({
        email: values.founders[i],
        shares: parseInt(values.founderAmountOfShares),
      });
    }
    for (let i = 0; i < values.directors.length; i++) {
      directors.push({
        email: values.directors[i],
        shares: parseInt(values.directorAmountOfShares),
      });
    }
    for (let i = 0; i < values.admins.length; i++) {
      admins.push(values.admins[i]);
    }

    // Ensure that the sum of all shares are attributed to FOUNDERS and ADMINS
    // Convert array of strings to array of integers
    let founderAmountOfShares = values.founderAmountOfShares.map((x) => {
      return parseInt(x);
    });
    let founderSum = founderAmountOfShares.reduce(
      (partialSum, a) => partialSum + a
    );

    if (values.directorAmountOfShares.length !== 0) {
      let directorAmountOfShares = values.directorAmountOfShares.map((x) => {
        return parseInt(x);
      });
      var directorSum = directorAmountOfShares.reduce(
        (partialSum, a) => partialSum + a
      );
    }

    // Add the sum of the array
    let totalSum;
    if (directorSum === undefined) {
      totalSum = founderSum;
    } else {
      totalSum = founderSum + directorSum;
    }

    // THIS IS WHERE DECIMAL LOGIC GOES
    let finalShareCount = values.shareCount;
    let finalCoinCount = values.stablecoinCount;

    for (let i = 0; i < values.decimalShares; i++) {
      finalShareCount *= 10;
    }

    for (let i = 0; i < values.decimalCoins; i++) {
      finalCoinCount *= 10;
    }

    if (totalSum === parseInt(values.shareCount)) {
      const data = {
        name: values.name,
        companyFunding: 309000,
        founders: founders,
        directors: directors,
        admins: admins,
        shares: {
          name: values.name,
          unitName: values.shareCountName,
          quantity: finalShareCount,
          decimal: parseInt(values.decimalShares),
        },
        coins: {
          name: values.name,
          unitName: values.shareCountName,
          quantity: finalCoinCount,
          decimal: parseInt(values.decimalCoins),
        },
        vaultName: values.name,
        vaultFunding: 205000,
      };
      await API.createCompany(data);
      resetForm();
      setModalIsOpen(false);
    } else {
      alert("Make sure all shares are accounted for!");
    }
  };

  let companyData = (
    <Box>
      <Typography>{notificationData[0]}</Typography>
      <Typography>{notificationData[1]}</Typography>
    </Box>
  );

  let createCompanyModal = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Field
            as={TextField}
            fullWidth
            label="Company Name"
            margin="normal"
            name="name"
            type="text"
            variant="outlined"
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "31% 31% 31%",
              gridRow: "auto auto",
              justifyContent: "space-between",
            }}
          >
            <Field
              as={TextField}
              fullWidth
              label="Share Count Name"
              margin="normal"
              name="shareCountName"
              type="text"
              variant="outlined"
              error={touched.shareCountName && Boolean(errors.shareCountName)}
              helperText={touched.shareCountName && errors.shareCountName}
            />
            <Field
              as={TextField}
              fullWidth
              label="Share Count"
              margin="normal"
              name="shareCount"
              type="text"
              variant="outlined"
              error={touched.shareCount && Boolean(errors.shareCount)}
              helperText={touched.shareCount && errors.shareCount}
            />
            <Field
              as={TextField}
              label="Decimal Shares"
              margin="normal"
              name="decimalShares"
              type="text"
              variant="outlined"
              error={touched.decimalShares && Boolean(errors.decimalShares)}
              helperText={touched.decimalShares && errors.decimalShares}
            />

            <Field
              as={TextField}
              label="Stablecoin Name"
              margin="normal"
              name="stablecoinName"
              type="text"
              variant="outlined"
              error={touched.stablecoinName && Boolean(errors.stablecoinName)}
              helperText={touched.stablecoinName && errors.stablecoinName}
            />
            <Field
              as={TextField}
              label="Stablecoin Count"
              margin="normal"
              name="stablecoinCount"
              type="text"
              variant="outlined"
              error={touched.stablecoinCount && Boolean(errors.stablecoinCount)}
              helperText={touched.stablecoinCount && errors.stablecoinCount}
            />
            <Field
              as={TextField}
              label="Decimal Coins"
              margin="normal"
              name="decimalCoins"
              type="text"
              variant="outlined"
              error={touched.decimalCoins && Boolean(errors.decimalCoins)}
              helperText={touched.decimalCoins && errors.decimalCoins}
            />
          </Box>
          <FieldArray name="founders">
            {({ remove, insert }) => (
              <Box>
                {touched.founders && touched.founders.length > 0 ? (
                  touched.founders.map((founders, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Field
                        as={TextField}
                        label={`Founder Email ${index + 1}`}
                        name={`founders.${index}`}
                        type="text"
                        variant="outlined"
                        error={touched.founders && Boolean(errors.founders)}
                        helperText={touched.founders && errors.founders}
                      />
                      <Field
                        as={TextField}
                        label={`Share amount`}
                        name={`founderAmountOfShares.${index}`}
                        type="text"
                        variant="outlined"
                        error={
                          touched.founderAmountOfShares &&
                          Boolean(errors.founderAmountOfShares)
                        }
                        helperText={
                          touched.founderAmountOfShares &&
                          errors.founderAmountOfShares
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => remove(index)}
                        >
                          -
                        </Button>
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => insert(index + 1, "")}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Button
                    sx={{ mt: 1, width: 135 }}
                    variant="contained"
                    onClick={() => insert("")}
                  >
                    Add a Founder
                  </Button>
                )}
              </Box>
            )}
          </FieldArray>
          <FieldArray name="directors">
            {({ remove, insert }) => (
              <Box>
                {touched.directors && touched.directors.length > 0 ? (
                  touched.directors.map((friend, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Field
                        as={TextField}
                        label={`Directors Email ${index + 1}`}
                        name={`directors.${index}`}
                        type="text"
                        variant="outlined"
                        error={touched.directors && Boolean(errors.directors)}
                        helperText={touched.directors && errors.directors}
                      />
                      <Field
                        as={TextField}
                        label={`Share amount`}
                        name={`directorAmountOfShares.${index}`}
                        type="text"
                        variant="outlined"
                        error={
                          touched.directorAmountOfShares &&
                          Boolean(errors.directorAmountOfShares)
                        }
                        helperText={
                          touched.directorAmountOfShares &&
                          errors.directorAmountOfShares
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => remove(index)}
                        >
                          -
                        </Button>
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => insert(index + 1, "")}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Button
                    sx={{ mt: 1, width: 135 }}
                    variant="contained"
                    onClick={() => insert("")}
                  >
                    Add a Director
                  </Button>
                )}
              </Box>
            )}
          </FieldArray>
          <FieldArray name="admins">
            {({ remove, insert }) => (
              <Box>
                {touched.admins && touched.admins.length > 0 ? (
                  touched.admins.map((friend, index) => (
                    <Box key={index} sx={{ display: "flex", mt: 1 }}>
                      <Field
                        as={TextField}
                        label={`Admins Email ${index + 1}`}
                        name={`admins.${index}`}
                        type="text"
                        variant="outlined"
                        error={touched.admins && Boolean(errors.admins)}
                        helperText={touched.admins && errors.admins}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => remove(index)}
                        >
                          -
                        </Button>
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => insert(index + 1, "")}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Button
                    sx={{ mt: 1, width: 135 }}
                    variant="contained"
                    onClick={() => insert("")}
                  >
                    Add an Admin
                  </Button>
                )}
              </Box>
            )}
          </FieldArray>
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              size="large"
              variant="contained"
              type="submit"
            >
              Create Company
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );

  return (
    <Box sx={LayoutConfig.defaultContainerSX}>
      <Container sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setModalIsOpen(true)}>
          Create Company
        </Button>
      </Container>
      {/* CREATE COMPANY MODAL */}
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Create a Company`}
        dialogContent={createCompanyModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
      {/* NOTIFICATION MODAL */}
      <EnhancedModal
        isOpen={open}
        dialogTitle={`Company Notification Details`}
        dialogContent={companyData}
        options={{
          onClose: () => setOpen(false),
          disableSubmit: true,
        }}
      />
    </Box>
  );
};

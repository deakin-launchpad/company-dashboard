import { useState } from "react";

import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/styles";

import { Box, Button, TextField, IconButton, Divider } from "@mui/material";

import * as Yup from "yup";
import { Formik, Form, Field /*FieldArray*/ } from "formik";
import { API } from "helpers/index";
import { onMessageListener } from "firebase";
import { Typography } from "../../../../node_modules/@mui/material/index";
import { EnhancedModal } from "components/index";

import TrashIcon from "../../../assets/trash.png";

export const CreateCompany = () => {
  const theme = useTheme();

  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  onMessageListener()
    .then((payload) => {
      //setNotificationData(payload.notification.body.split(","));
      //setOpen(true);
      console.log("payload", payload);
    })
    .catch((err) => console.log("failed: ", err));

  const initialValues = {
    name: "",
    //founders: [{ email: "aa", founderAmountOfShares: "yy" }],
    //directors: [{ email: "ok", directorAmountOfShares: "yes" }],
    founders: [],
    founderAmountOfShares: [],
    directors: [],
    directorAmountOfShares: [],
    admins: "" /*[{ email: "no" }]*/,
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
      founders: Yup.array().required("Founders must be added"),
      // .test("Email Exists", async function (value) {
      //   return await API.doesUserExist(value)
      //     .then((response) => {
      //       return response.data.exists;
      //     })
      //     .catch((error) => {
      //       return error;
      //     });
      // }),
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
    console.log("Form Values before Submit:", values);
    let founders = [];
    let admins = [];
    let directors = [];
    console.log("Founders:", values.founders);
    console.log("Founder Amount Of Shares:", values.founderAmountOfShares);
    for (let i = 0; i < values.founders.length; i++) {
      founders.push({
        email: values.founders[i],
        shares: parseInt(values.founderAmountOfShares[i]),
      });
    }
    for (let i = 0; i < values.directors.length; i++) {
      directors.push({
        email: values.directors[i],
        shares: parseInt(values.directorAmountOfShares[i]),
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
      //setModalIsOpen(false);
    } else {
      alert("Make sure all shares are accounted for!");
    }
  };
  /*
  let companyData = (
    <Box>
      <Typography>{notificationData[0]}</Typography>
      <Typography>{notificationData[1]}</Typography>
    </Box>
  );*/

  //TextFeild styles
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

  //IconButton style
  /*
  const iconButtonStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginRight: "22px",
    marginTop: "-9px",
  };*/
  let createCompanyModal = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, touched, isSubmitting, values, setFieldValue }) => (
        <Form style={{ marginTop: "50px" }}>
          <Box sx={{ ml: "30px", mr: "30px" }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "600",
                color: "white",
                mb: "10px",
              }}
            >
              Add New One
            </Typography>

            <Field
              fullWidth
              as={CustomField}
              autoComplete="off"
              label="Company Name"
              margin="normal"
              name="name"
              type="text"
              variant="outlined"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              InputLabelProps={InputLabelStyle}
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "31% 31% 31%",
              gridRow: "auto auto",
              justifyContent: "space-between",
              ml: "30px",
              mr: "30px",
            }}
          >
            <Field
              fullWidth
              as={CustomField}
              autoComplete="off"
              label="Share Count Name"
              margin="normal"
              name="shareCountName"
              type="text"
              variant="outlined"
              error={touched.shareCountName && Boolean(errors.shareCountName)}
              helperText={touched.shareCountName && errors.shareCountName}
              InputLabelProps={InputLabelStyle}
            />
            <Field
              fullWidth
              as={CustomField}
              autoComplete="off"
              label="Share Count"
              margin="normal"
              name="shareCount"
              type="text"
              variant="outlined"
              error={touched.shareCount && Boolean(errors.shareCount)}
              helperText={touched.shareCount && errors.shareCount}
              InputLabelProps={InputLabelStyle}
            />
            <Field
              as={CustomField}
              autoComplete="off"
              label="Decimal Shares"
              margin="normal"
              name="decimalShares"
              type="text"
              variant="outlined"
              error={touched.decimalShares && Boolean(errors.decimalShares)}
              helperText={touched.decimalShares && errors.decimalShares}
              InputLabelProps={InputLabelStyle}
            />

            <Field
              as={CustomField}
              autoComplete="off"
              label="Stablecoin Name"
              margin="normal"
              name="stablecoinName"
              type="text"
              variant="outlined"
              error={touched.stablecoinName && Boolean(errors.stablecoinName)}
              helperText={touched.stablecoinName && errors.stablecoinName}
              InputLabelProps={InputLabelStyle}
            />
            <Field
              as={CustomField}
              autoComplete="off"
              label="Stablecoin Count"
              margin="normal"
              name="stablecoinCount"
              type="text"
              variant="outlined"
              error={touched.stablecoinCount && Boolean(errors.stablecoinCount)}
              helperText={touched.stablecoinCount && errors.stablecoinCount}
              InputLabelProps={InputLabelStyle}
            />
            <Field
              as={CustomField}
              autoComplete="off"
              label="Decimal Coins"
              margin="normal"
              name="decimalCoins"
              type="text"
              variant="outlined"
              error={touched.decimalCoins && Boolean(errors.decimalCoins)}
              helperText={touched.decimalCoins && errors.decimalCoins}
              InputLabelProps={InputLabelStyle}
            />
          </Box>
          <Typography
            style={{
              marginTop: "5px",
              marginLeft: "3.5%",
              color: "white",
              fontSize: "15px",
              fontWeight: "400",
              fontFamily: "Roboto",
            }}
          >
            Founders
          </Typography>
          {values.founders.length > 0 &&
            values.founders.map((founder, index) => (
              <Box
                key={index}
                style={{
                  marginLeft: "3.5%",
                  display: "flex",
                  gap: "120px",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                    fontSize: "13px",
                    flex: 2,
                  }}
                >
                  {`${index + 1}. Founder Email: ${founder}`}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                    fontSize: "13px",
                    flex: 2,
                  }}
                >
                  {`Share amount: ${values.founderAmountOfShares[index]}`}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {index >= 0 && (
                    <IconButton
                      onClick={() => {
                        const newFounders = [...values.founders];
                        const newShares = [...values.founderAmountOfShares];
                        newFounders.splice(index, 1);
                        newShares.splice(index, 1);
                        setFieldValue("founders", newFounders);
                        setFieldValue("founderAmountOfShares", newShares);
                      }}
                      aria-label="Delete"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <img
                        src={TrashIcon}
                        alt="Trash Icon"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#717F8B",
                          fontFamily: "Roboto",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </Typography>
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          <Button
            sx={{
              ml: "43%",
              mt: "1%",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
            type="button"
            onClick={() => setIsFounderModalOpen(true)}
          >
            Add Founder
          </Button>
          <Divider sx={{ border: "0.5px solid", mt: "10px" }} />

          <EnhancedModal
            isOpen={isFounderModalOpen}
            dialogTitle={`Add Founder`}
            dialogContent={
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "20px",
                  marginLeft: "8%",
                  marginTop: "5%",
                }}
              >
                <Field
                  as={CustomField}
                  autoComplete="off"
                  label={`Founder Email`}
                  name={`newFounderEmail`}
                  type="text"
                  variant="outlined"
                  error={touched.founders && Boolean(errors.founders)}
                  helperText={touched.founders && errors.founders}
                  InputLabelProps={InputLabelStyle}
                />
                <Field
                  as={CustomField}
                  autoComplete="off"
                  label={`Share amount`}
                  name={`newFounderShares`}
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
                  InputLabelProps={InputLabelStyle}
                />
                <Button
                  sx={{ mt: 1, width: 135 }}
                  variant="contained"
                  type="button"
                  onClick={() => {
                    const newFounders = [
                      ...values.founders,
                      values.newFounderEmail,
                    ];
                    const newShares = [
                      ...values.founderAmountOfShares,
                      values.newFounderShares,
                    ];
                    setFieldValue("founders", newFounders);
                    setFieldValue("founderAmountOfShares", newShares);
                    setIsFounderModalOpen(false);
                    setFieldValue("newFounderEmail", "");
                    setFieldValue("newFounderShares", "");
                  }}
                >
                  Add
                </Button>
              </Box>
            }
            options={{
              onClose: () => setIsFounderModalOpen(false),
              disableSubmit: true,
            }}
          />

          <Typography
            style={{
              marginTop: "5px",
              marginLeft: "3.5%",
              color: "white",
              fontSize: "15px",
              fontWeight: "400",
              fontFamily: "Roboto",
            }}
          >
            Directors
          </Typography>
          {values.directors.length > 0 &&
            values.directors.map((director, index) => (
              <Box
                key={index}
                style={{
                  marginLeft: "3.5%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                    fontSize: "13px",
                    flex: 2,
                  }}
                >
                  {`${index + 1}. Director Email: ${director}`}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                    fontSize: "13px",
                    flex: 2,
                  }}
                >
                  {`Share amount: ${values.directorAmountOfShares[index]}`}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {index >= 0 && (
                    <IconButton
                      onClick={() => {
                        const newDirectors = [...values.directors];
                        const newShares = [...values.directorAmountOfShares];
                        newDirectors.splice(index, 1);
                        newShares.splice(index, 1);
                        setFieldValue("directors", newDirectors);
                        setFieldValue("directorAmountOfShares", newShares);
                      }}
                      aria-label="Delete"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <img
                        src={TrashIcon}
                        alt="Trash Icon"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#717F8B",
                          fontFamily: "Roboto",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </Typography>
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          <Button
            sx={{
              ml: "43%",
              mt: "1%",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
            type="button"
            onClick={() => setIsDirectorModalOpen(true)}
          >
            Add Director
          </Button>
          <Divider sx={{ border: "0.5px solid", mt: "10px" }} />

          <EnhancedModal
            isOpen={isDirectorModalOpen}
            dialogTitle={`Add Director`}
            dialogContent={
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "20px",
                  marginLeft: "8%",
                  marginTop: "5%",
                }}
              >
                <Field
                  as={CustomField}
                  autoComplete="off"
                  label={`Director Email`}
                  name={`newDirectorEmail`}
                  type="text"
                  variant="outlined"
                  error={touched.directors && Boolean(errors.directors)}
                  helperText={touched.directors && errors.directors}
                  InputLabelProps={InputLabelStyle}
                />
                <Field
                  as={CustomField}
                  autoComplete="off"
                  label={`Share amount`}
                  name={`newDirectorShares`}
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
                  InputLabelProps={InputLabelStyle}
                />
                <Button
                  sx={{ mt: 1, width: 135 }}
                  variant="contained"
                  type="button"
                  onClick={() => {
                    const newDirectors = [
                      ...values.directors,
                      values.newDirectorEmail,
                    ];
                    const newShares = [
                      ...values.directorAmountOfShares,
                      values.newDirectorShares,
                    ];
                    setFieldValue("directors", newDirectors);
                    setFieldValue("directorAmountOfShares", newShares);
                    setIsDirectorModalOpen(false);
                    setFieldValue("newDirectorEmail", "");
                    setFieldValue("newDirectorShares", "");
                  }}
                >
                  Add
                </Button>
              </Box>
            }
            options={{
              onClose: () => setIsDirectorModalOpen(false),
              disableSubmit: true,
            }}
          />
          <Typography
            style={{
              marginTop: "5px",
              marginLeft: "3.5%",
              color: "white",
              fontSize: "15px",
              fontWeight: "400",
              fontFamily: "Roboto",
            }}
          >
            Admins
          </Typography>
          {values.admins.length > 0 &&
            values.admins.map((admin, index) => (
              <Box
                key={index}
                style={{
                  marginLeft: "3.5%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    color: "white",
                    fontSize: "13px",
                    flex: 2,
                  }}
                >
                  {`${index + 1}. Admin Email: ${admin}`}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {index >= 0 && (
                    <IconButton
                      onClick={() => {
                        const newAdmins = [...values.admins];
                        newAdmins.splice(index, 1);
                        setFieldValue("admins", newAdmins);
                      }}
                      aria-label="Delete"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <img
                        src={TrashIcon}
                        alt="Trash Icon"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#717F8B",
                          fontFamily: "Roboto",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </Typography>
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          <Button
            sx={{
              ml: "43%",
              mt: "1%",
              paddingLeft: "18px",
              paddingRight: "18px",
            }}
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
          >
            Add Admin
          </Button>
          <Divider sx={{ border: "0.5px solid", mt: "10px" }} />

          <EnhancedModal
            isOpen={isAdminModalOpen}
            dialogTitle={`Add Admin`}
            dialogContent={
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "20px",
                  marginLeft: "20%",
                  marginTop: "5%",
                }}
              >
                <Field
                  as={CustomField}
                  autoComplete="off"
                  label={`Admin Email`}
                  name={`newAdminEmail`}
                  type="text"
                  variant="outlined"
                  error={touched.admins && Boolean(errors.admins)}
                  helperText={touched.admins && errors.admins}
                  InputLabelProps={InputLabelStyle}
                />
                <Button
                  sx={{ mt: 1, width: 135 }}
                  variant="contained"
                  type="button"
                  onClick={() => {
                    const newAdmins = [...values.admins, values.newAdminEmail];
                    setFieldValue("admins", newAdmins);
                    setIsAdminModalOpen(false);
                    setFieldValue("newAdminEmail", "");
                  }}
                >
                  Add
                </Button>
              </Box>
            }
            options={{
              onClose: () => setIsAdminModalOpen(false),
              disableSubmit: true,
            }}
          />

          <Box sx={{ mt: 2, ml: "40%" }}>
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
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "89vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          marginTop: "20px",
          width: "93%",
          minHeight: "120vh",
          marginBottom: "20px",
          overflowY: "auto",
          backgroundColor: theme.palette.background.secondary,
          borderRadius: "5px",
        }}
      >
        {createCompanyModal}
      </Box>
    </Box>
  );
};
{
  {
    /*<pre>{JSON.stringify(values, null, 2)}</pre>*/
  }
}

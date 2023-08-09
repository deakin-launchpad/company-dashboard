import { useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/styles";

import { Box, Button, TextField, IconButton, Divider } from "@mui/material";

import * as Yup from "yup";
import { Formik, Form, FieldArray } from "formik";
import { API } from "helpers/index";
import { onMessageListener } from "firebase";
import { Typography } from "../../../../node_modules/@mui/material/index";
import { EnhancedModal } from "components/index";
import TrashIcon from "../../../assets/trash.png";

export const CreateCompany = () => {
  const theme = useTheme();
  const [, /*modalIsOpen*/ setModalIsOpen] = useState(false);
  const [, /*open*/ setOpen] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);
  const [modalFounderEmail, setModalFounderEmail] = useState("");
  const [modalFounderAmountOfShares, setModalFounderAmountOfShares] =
    useState("");

  useEffect(() => {}, [modalFounderEmail, modalFounderAmountOfShares]);

  onMessageListener()
    .then((payload) => {
      setNotificationData(payload.notification.body.split(","));
      setOpen(true);
      console.log("payload", payload);
    })
    .catch((err) => console.log("failed: ", err));

  const initialValues = {
    name: "",
    founders: [{ email: "aa", founderAmountOfShares: "yy" }],
    directors: [],
    founderAmountOfShares: [],
    directorAmountOfShares: [],
    admins: [],
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
  const iconButtonStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginRight: "22px",
    marginTop: "-9px",
  };
  let createCompanyModal = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, touched, isSubmitting, values }) => (
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

            <CustomField
              fullWidth
              label="Company Name"
              margin="normal"
              name="name"
              type="text"
              variant="outlined"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              InputLabelProps={{
                shrink: true,
                disableAnimation: true,
                style: {
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "400",
                  borderBottom: "black",
                  marginLeft: "-10px",
                  fontFamily: "Roboto",
                  bottom: "-50px",
                },
              }}
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
            <CustomField
              fullWidth
              label="Share Count Name"
              margin="normal"
              name="shareCountName"
              type="text"
              variant="outlined"
              error={touched.shareCountName && Boolean(errors.shareCountName)}
              helperText={touched.shareCountName && errors.shareCountName}
              InputLabelProps={{
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
              }}
            />
            <CustomField
              fullWidth
              label="Share Count"
              margin="normal"
              name="shareCount"
              type="text"
              variant="outlined"
              error={touched.shareCount && Boolean(errors.shareCount)}
              helperText={touched.shareCount && errors.shareCount}
              InputLabelProps={{
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
              }}
            />
            <CustomField
              label="Decimal Shares"
              margin="normal"
              name="decimalShares"
              type="text"
              variant="outlined"
              error={touched.decimalShares && Boolean(errors.decimalShares)}
              helperText={touched.decimalShares && errors.decimalShares}
              InputLabelProps={{
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
              }}
            />

            <CustomField
              label="Stablecoin Name"
              margin="normal"
              name="stablecoinName"
              type="text"
              variant="outlined"
              error={touched.stablecoinName && Boolean(errors.stablecoinName)}
              helperText={touched.stablecoinName && errors.stablecoinName}
              InputLabelProps={{
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
              }}
            />
            <CustomField
              label="Stablecoin Count"
              margin="normal"
              name="stablecoinCount"
              type="text"
              variant="outlined"
              error={touched.stablecoinCount && Boolean(errors.stablecoinCount)}
              helperText={touched.stablecoinCount && errors.stablecoinCount}
              InputLabelProps={{
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
              }}
            />
            <CustomField
              label="Decimal Coins"
              margin="normal"
              name="decimalCoins"
              type="text"
              variant="outlined"
              error={touched.decimalCoins && Boolean(errors.decimalCoins)}
              helperText={touched.decimalCoins && errors.decimalCoins}
              InputLabelProps={{
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
              }}
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
          <FieldArray name="founders">
            {({ push, remove }) => (
              <Box>
                {values.founders.map((founder, index) => (
                  <Box
                    key={index}
                    style={{
                      marginLeft: "3.5%",
                      display: "flex",
                      gap: "120px",
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
                      {index}.Founder
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Roboto",
                        color: "white",
                        fontSize: "13px",
                        flex: 2,
                      }}
                    >
                      Email: {founder.email}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Roboto",
                        color: "white",
                        fontSize: "13px",
                        flex: 3,
                      }}
                    >
                      Amount Of Shares: {founder.founderAmountOfShares}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => remove(index)}
                        aria-label="Delete"
                        style={iconButtonStyles}
                      >
                        <img src={TrashIcon} alt="Image" />
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
                    </Box>
                  </Box>
                ))}

                <Button
                  sx={{ ml: "43%", mt: "1%" }}
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
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "20px",
                          marginLeft: "8%",
                          marginTop: "5%",
                        }}
                      >
                        <CustomField
                          type="text"
                          label="Founder Email"
                          onChange={(e) => {
                            console.log(
                              "Founder Email changed:",
                              e.target.value
                            );
                            setModalFounderEmail(e.target.value);
                          }}
                          error={touched.founders && Boolean(errors.founders)}
                          helperText={touched.founders && errors.founders}
                          InputLabelProps={{
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
                          }}
                        />

                        <CustomField
                          type="text"
                          label="Share Amount"
                          onChange={(e) => {
                            console.log(
                              "Share Amount changed:",
                              e.target.value
                            );
                            setModalFounderAmountOfShares(e.target.value);
                          }}
                          error={touched.founders && Boolean(errors.founders)}
                          helperText={touched.founders && errors.founders}
                          InputLabelProps={{
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
                          }}
                        />

                        <Button
                          sx={{ mt: "12px" }}
                          type="button"
                          onClick={() => {
                            console.log(
                              "modalFounderEmail:",
                              modalFounderEmail
                            );
                            console.log(
                              "modalFounderAmountOfShares:",
                              modalFounderAmountOfShares
                            );

                            setModalFounderEmail((prevEmail) => {
                              setModalFounderAmountOfShares((prevAmount) => {
                                push({
                                  email: prevEmail,
                                  founderAmountOfShares: prevAmount,
                                });

                                setIsFounderModalOpen(false);
                                return "";
                              });
                              return "";
                            });
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  }
                  options={{
                    onClose: () => setIsFounderModalOpen(false),
                    disableSubmit: true,
                  }}
                />
              </Box>
            )}
          </FieldArray>

          <pre>{JSON.stringify(values, null, 2)}</pre>

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
                      <CustomField
                        label={`Directors Email ${index + 1}`}
                        name={`directors.${index}`}
                        type="text"
                        variant="outlined"
                        error={touched.directors && Boolean(errors.directors)}
                        helperText={touched.directors && errors.directors}
                        InputLabelProps={{
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
                        }}
                      />
                      <CustomField
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
                        InputLabelProps={{
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
                        }}
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
                      <CustomField
                        label={`Admins Email ${index + 1}`}
                        name={`admins.${index}`}
                        type="text"
                        variant="outlined"
                        error={touched.admins && Boolean(errors.admins)}
                        helperText={touched.admins && errors.admins}
                        InputLabelProps={{
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
                        }}
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
          minHeight: "80vh",
          height: "auto",
          overflowY: "hidden",
          backgroundColor: theme.palette.background.secondary,
          borderRadius: "5px",
        }}
      >
        {createCompanyModal}
        <EnhancedModal
          isOpen={false}
          dialogTitle={`Company Notification Details`}
          dialogContent={companyData}
          options={{
            onClose: () => setOpen(false),
            disableSubmit: true,
          }}
        />
      </Box>
    </Box>
  );
};

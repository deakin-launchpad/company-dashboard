/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Box, Container, Button, TextField } from "@mui/material";
import { LayoutConfig } from "constants/index";
import { EnhancedModal } from "components/index";
import * as Yup from "yup";
import { Formik, Form, Field, FieldArray } from "formik";
import { API } from "helpers/index";

export const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const initialValues = {
    companyName: "",
    founders: "",
    directors: "",
    admins: "",
    shareCount: "",
    stablecoinCount: "",
  };

  const validationSchema = () => {
    return Yup.object().shape({
      companyName: Yup.string().max(255).required("Company Name Is Required"),
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
      directors: Yup.array().test("Email Exists", async function (value) {
        return await API.doesUserExist(value)
          .then((response) => {
            return response.data.exists;
          })
          .catch((error) => {
            return error;
          });
      }),
      admins: Yup.array().test("Email Exists", async function (value) {
        return await API.doesUserExist(value)
          .then((response) => {
            return response.data.exists;
          })
          .catch((error) => {
            return error;
          });
      }),
      shareCount: Yup.number()
        .positive()
        .integer()
        .required("Share count must be added"),
      stablecoinCount: Yup.number()
        .positive()
        .integer()
        .required("Stablecoin count must be added"),
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      companyName: values.companyName,
      founders: values.founders,
      directors: values.directors,
      admins: values.admins,
      shareCount: parseInt(values.shareCount),
      stablecoinCount: parseInt(values.stablecoinCount),
    };
    console.log(data);
    resetForm();
  };

  let createServiceModal = (
    <Box>
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
              name="companyName"
              type="text"
              variant="outlined"
              error={touched.companyName && Boolean(errors.companyName)}
              helperText={touched.companyName && errors.companyName}
            />
            <FieldArray name="founders">
              {({ remove, insert }) => (
                <Box>
                  {touched.founders && touched.founders.length > 0 ? (
                    touched.founders.map((friend, index) => (
                      <Box key={index} sx={{ display: "flex", mt: 1 }}>
                        <Field
                          as={TextField}
                          label={`Founder ID ${index + 1}`}
                          name={`founders.${index}`}
                          type="text"
                          variant="outlined"
                          error={touched.founders && Boolean(errors.founders)}
                          helperText={touched.founders && errors.founders}
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
                      <Box key={index} sx={{ display: "flex", mt: 1 }}>
                        <Field
                          as={TextField}
                          label={`Directors ID ${index + 1}`}
                          name={`directors.${index}`}
                          type="text"
                          variant="outlined"
                          error={touched.directors && Boolean(errors.directors)}
                          helperText={touched.directors && errors.directors}
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
            {/* FINAL BELOW */}
            <FieldArray name="admins">
              {({ remove, insert }) => (
                <Box>
                  {touched.admins && touched.admins.length > 0 ? (
                    touched.admins.map((friend, index) => (
                      <Box key={index} sx={{ display: "flex", mt: 1 }}>
                        <Field
                          as={TextField}
                          label={`Admins ID ${index + 1}`}
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

            {/* FINAL ABOVE */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "48% 48%",
                gridRow: "auto auto",
                justifyContent: "space-between",
              }}
            >
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
                fullWidth
                label="Stablecoin Count"
                margin="normal"
                name="stablecoinCount"
                type="text"
                variant="outlined"
                error={
                  touched.stablecoinCount && Boolean(errors.stablecoinCount)
                }
                helperText={touched.stablecoinCount && errors.stablecoinCount}
              />
            </Box>
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
    </Box>
  );

  return (
    <Box sx={LayoutConfig.defaultContainerSX}>
      <Container sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setModalIsOpen(true)}>
          Create Company
        </Button>
      </Container>
      <EnhancedModal
        isOpen={modalIsOpen}
        dialogTitle={`Create a Company`}
        dialogContent={createServiceModal}
        options={{
          onClose: () => setModalIsOpen(false),
          disableSubmit: true,
        }}
      />
    </Box>
  );
};

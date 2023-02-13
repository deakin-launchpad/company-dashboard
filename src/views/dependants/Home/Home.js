import { useState } from "react";
import { Box, Container, Button, TextField } from "@mui/material";
import { LayoutConfig } from "constants/index";
import { EnhancedModal } from "components/index";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

export const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const initialValues = {
    companyName: "",
    founders: "",
    directors: "",
    admins: "",
    shareCount: "",
    sharePrice: "",
    stablecoinCount: "",
    stablecoinPrice: "",
  };

  const validationSchema = () => {
    return Yup.object().shape({
      companyName: Yup.string().max(255).required("Company Name Is Required"),
      founders: Yup.string().required("Founders must be added"),
      directors: Yup.string(),
      admins: Yup.string(),
      shareCount: Yup.number()
        .positive()
        .integer()
        .required("Share count must be added"),
      sharePrice: Yup.number()
        .positive()
        .integer()
        .required("Share price must be added"),
      stablecoinCount: Yup.number()
        .positive()
        .integer()
        .required("Stablecoin count must be added"),
      stablecoinPrice: Yup.number()
        .positive()
        .integer()
        .required("Stablecoin price must be added"),
    });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      companyName: values.companyName,
      founders: values.founders,
      directors: values.directors,
      admins: values.admins,
      shareCount: values.shareCount,
      sharePrice: values.sharePrice,
      stablecoinCount: values.stablecoinCount,
      stablecoinPrice: values.stablecoinPrice,
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
            <Field
              as={TextField}
              fullWidth
              label="Founder ID"
              margin="normal"
              name="founders"
              type="text"
              variant="outlined"
              error={touched.founders && Boolean(errors.founders)}
              helperText={touched.founders && errors.founders}
            />
            <Field
              as={TextField}
              fullWidth
              label="Director IDs"
              margin="normal"
              name="directors"
              type="text"
              variant="outlined"
              error={touched.directors && Boolean(errors.directors)}
              helperText={touched.directors && errors.directors}
            />
            <Field
              as={TextField}
              fullWidth
              label="Admin IDs"
              margin="normal"
              name="admins"
              type="text"
              variant="outlined"
              error={touched.admins && Boolean(errors.admins)}
              helperText={touched.admins && errors.admins}
            />
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
                label="Share Price"
                margin="normal"
                name="sharePrice"
                type="text"
                variant="outlined"
                error={touched.sharePrice && Boolean(errors.sharePrice)}
                helperText={touched.sharePrice && errors.sharePrice}
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
              <Field
                as={TextField}
                fullWidth
                label="Stablecoin Price"
                margin="normal"
                name="stablecoinPrice"
                type="text"
                variant="outlined"
                error={
                  touched.stablecoinPrice && Boolean(errors.stablecoinPrice)
                }
                helperText={touched.stablecoinPrice && errors.stablecoinPrice}
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

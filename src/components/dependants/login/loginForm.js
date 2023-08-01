/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  styled,
  InputLabel,
} from "@mui/material";
import { LoginContext, DeviceInfoContext } from "contexts";
import { ConnectionConfig, DeveloperConfig } from "constants/index";
import { fetchToken } from "../../../firebase";

export const LoginForm = (props) => {
  const { devMode, setAccessToken } = useContext(LoginContext);
  const { deviceUUID } = useContext(DeviceInfoContext);
  const [messagingToken, setMessagingToken] = useState();

  useEffect(() => {
    fetchToken(setMessagingToken);
  }, []);

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
    },
    validationSchema: () => {
      if (devMode)
        return Yup.object().shape({
          emailId: Yup.string().email("Must be a valid Email").max(255),
          password: Yup.string().max(255),
        });
      return Yup.object().shape({
        emailId: Yup.string()
          .email("Must be a valid Email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().min(6).max(255).required("Password is required"),
      });
    },
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (devMode)
        values = {
          emailId: DeveloperConfig.devDetails.user,
          password: DeveloperConfig.devDetails.password,
        };

      const response = await props.login(values);
      if (response.success) {
        if (
          !(props.onSuccess instanceof Function) ||
          !ConnectionConfig.useACL
        ) {
          setAccessToken(response.data);
          setStatus({ success: true });
          const info = { token: messagingToken, deviceUUID: deviceUUID };
          await props.token(info);
        } else {
          const response = await props.onSuccess();
          if (response) {
            setAccessToken(response.data);
            setStatus({ success: true });
          } else setStatus({ success: false });
        }
        setSubmitting(false);
      } else {
        setStatus({ success: false });
        setSubmitting(false);
      }
    },
  });

  const inputStyles = {
    height: "30px",
    borderRadius: "2px",
    marginTop: "-3%",
    fontSize: "12px",
    backgroundColor: "#162A3C",
  };

  const CustomInputLabel = styled(InputLabel)({
    fontSize: "12px",
    color: "white",
    fontWeight: "300",
  });
  let form = (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      style={{
        maxHeight: "90%",
        overflowY: "hidden",
        maxWidth: "80%",
        marginLeft: "9%",
      }}
    >
      <CustomInputLabel htmlFor="email">Email Address</CustomInputLabel>
      <TextField
        error={formik.touched.emailId && Boolean(formik.errors.emailId)}
        fullWidth
        helperText={formik.touched.emailId && formik.errors.emailId}
        margin="normal"
        name="emailId"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={
          devMode ? DeveloperConfig.devDetails.user : formik.values.emailId
        }
        variant="outlined"
        InputProps={{ style: inputStyles }}
      />
      <CustomInputLabel htmlFor="password">Password</CustomInputLabel>
      <TextField
        error={formik.touched.password && Boolean(formik.errors.password)}
        fullWidth
        helperText={formik.touched.password && formik.errors.password}
        margin="normal"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="password"
        value={
          devMode ? DeveloperConfig.devDetails.password : formik.values.password
        }
        variant="outlined"
        InputProps={{ style: inputStyles }}
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{formik.errors.submit}</FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          disabled={formik.isSubmitting}
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            marginTop: "20px",
            width: "100%",
            height: "27px",
            borderRadius: "8px",
            backgroundColor: "#0D539B",
            typography: {
              fontFamily: "Roboto, sans-serif",
            },
          }}
        >
          Log In &gt;
        </Button>
      </Box>
    </form>
  );
  return form;
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

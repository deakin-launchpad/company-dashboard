/***
 *  Created by Sanchit Dang
 ***/
import { LoadingScreen } from "components";
import { LayoutConfig } from "constants/index";
import { LoginContext } from "contexts";
import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  AuthCallback,
  Example,
  FourOFour,
  Home,
  Login,
  MobileMenu,
  Register,
} from "views";
import { Layout } from "./layout";
import { onMessageListener } from "firebase";
import { notify } from "components/common/Notification";

const AuthRoute = ({ children, redirectTo, parentProps, loginStatus }) => {
  onMessageListener()
    .then((payload) => {
      console.log("payload", payload);
      notify(payload.notification.body);
    })
    .catch((err) => console.log("failed: ", err));
  return loginStatus === false ? (
    <Navigate to={redirectTo} {...parentProps} />
  ) : (
    children
  );
};

AuthRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
  parentProps: PropTypes.any.isRequired,
  loginStatus: PropTypes.bool.isRequired,
};

const UnauthRoute = ({ children, redirectTo, parentProps, loginStatus }) => {
  return !loginStatus ? (
    children
  ) : (
    <Navigate to={redirectTo} {...parentProps} />
  );
};

UnauthRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
  parentProps: PropTypes.any.isRequired,
  loginStatus: PropTypes.bool.isRequired,
};

export const AppRoutes = (props) => {
  const { loginStatus } = useContext(LoginContext);
  let landingPage =
    LayoutConfig.landingPage !== undefined
      ? LayoutConfig.landingPage !== ""
        ? LayoutConfig.landingPage
        : "/home"
      : "/home";
  if (loginStatus === undefined) return <LoadingScreen />;
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <UnauthRoute
            redirectTo={landingPage}
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Navigate to={{ pathname: "/login" }} {...props} />
          </UnauthRoute>
        }
      />
      <Route
        exact
        path="/auth/callback/:ssoToken"
        element={
          <UnauthRoute
            redirectTo={landingPage}
            loginStatus={loginStatus}
            parentProps={props}
          >
            <AuthCallback {...props} />
          </UnauthRoute>
        }
      />
      <Route
        exact
        path="/login"
        element={
          <UnauthRoute
            redirectTo={landingPage}
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Login {...props} />
          </UnauthRoute>
        }
      />
      <Route
        exact
        path="/register"
        element={
          <UnauthRoute
            redirectTo={landingPage}
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Register {...props} />
          </UnauthRoute>
        }
      />
      <Route
        exact
        path="/home"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <Home {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/menu"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <MobileMenu {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/examples"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <Example {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              {" "}
              <FourOFour {...props} />
            </Layout>
          </AuthRoute>
        }
      />
    </Routes>
  );
};

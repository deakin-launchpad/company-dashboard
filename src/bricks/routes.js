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
  FourOFour,
  Home,
  Landing,
  Login,
  MobileMenu,
  Register,
  AlgoCreateCompany,
  EthCreateCompany,
  EthCompanyDetails,
  AlgoCompanyDetails,
  Proposal,
  AlgoProposalDetails
} from "views";
import { Layout } from "./layout";

const AuthRoute = ({ children, redirectTo, parentProps, loginStatus }) => {
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
            <Landing {...props} />
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
        path="/ethCompany/:appId"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <EthCompanyDetails {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/algoCompany/:appId"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <AlgoCompanyDetails {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/createAlgoCompany"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <AlgoCreateCompany {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/createEthCompany"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <EthCreateCompany {...props} />
            </Layout>
          </AuthRoute>
        }
      />
      <Route
        exact
        path="/proposals"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <Proposal {...props} />
            </Layout>
          </AuthRoute>
        }
      />

      <Route
        exact
        path="/proposals/:proposalId"
        element={
          <AuthRoute
            redirectTo="/login"
            loginStatus={loginStatus}
            parentProps={props}
          >
            <Layout>
              <AlgoProposalDetails {...props} />
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

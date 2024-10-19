import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Home from "./Pages/home/Home";
import Settings from "./Pages/settings/Settings";
import WellbeingApps from "./Pages/wellbeingApps/WellbeingApps";
import CompanyView from "./Pages/companyView/CompanyView";
import Login from "./Pages/login/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teams from "./Pages/teams/Teams";
import PrivateRoute from "./routes/privateRoute";
import PublicRoutes from "./routes/publicRoutes";
import PrivateRoutes from "./routes/privateRoutes";
import SignUp from "./Pages/signUp/signup";
import GoogleAuthRedirect from "./Pages/googleRedirect/GoogleRedirect";
import FogotPassword from "./Pages/fogotPassword/fogotPassword";
import ResetPassword from "./Pages/resetPassword/resetPassword";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoutes Component={Login} />} />
          <Route path="/signup" element={<PublicRoutes Component={SignUp} />} />
          <Route
            path="/forgotPassword"
            element={<PublicRoutes Component={FogotPassword} />}
          />
          <Route
            path="/resetPassword/:token"
            element={<PublicRoutes Component={ResetPassword} />}
          />
          <Route
            path="/redirect"
            element={<PublicRoutes Component={GoogleAuthRedirect} />}
          />
          <Route element={<PrivateRoutes />}>
            <Route
              path="/dashboard"
              element={<PrivateRoute Component={Home} />}
            />
            <Route path="/teams" element={<PrivateRoute Component={Teams} />} />
            <Route
              path="/company-view"
              element={<PrivateRoute Component={CompanyView} />}
            />
            <Route
              path="/wellbeing-apps"
              element={<PrivateRoute Component={WellbeingApps} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute Component={Settings} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

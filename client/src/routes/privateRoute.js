import React from "react";
import { Box } from "@chakra-ui/react";

import Sidebar from "../comps/Sidebar";
import Header from "../comps/Header";

const PrivateRoute = ({ Component }) => {
  return (
    <div className="App">
      <Box>
        <Sidebar />
        <Box className="dashboardContent">
          <Header />
          <Box>
            <Component />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default PrivateRoute;

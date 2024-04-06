import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.signin);
  const toast = useToast();
  useEffect(() => {
    if (isAuthenticated === false) {
      toast({
        title: "Authentication expired. Please login again!",
        status: "info",
        position: "top-right",
        isClosable: true,
      });
    }
  }, [isAuthenticated]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

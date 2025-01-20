import { useState } from "react";
import axios from "axios";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  InputRightElement,
  Image,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { FaLock } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

import logo from "../../assets/img/mydailyLogo.png";

const CFaLock = chakra(FaLock);

const FormSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], 'Must match "password" field value')
    .required("Required"),
});

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  let { token } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleConfirmShowClick = () =>
    setConfirmShowPassword(!confirmShowPassword);

  const handleResetPassword = (values) => {
    if (token && values && values.confirmPassword) {
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}api/auth/updatePassword/${token}`,
          { password: values?.confirmPassword },
        )
        .then((res) => {
          toast({
            title: res.data.message,
            status: "success",
            position: "top-right",
            isClosable: true,
          });
          navigate("/", { replace: true });
        })
        .catch((error) => {
          toast({
            title: error.response?.data?.message,
            status: "error",
            position: "top-right",
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Issue of password or token",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };
  return (
    <Formik
      initialValues={{
        password: "",
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => handleResetPassword(values)}
    >
      {({ handleSubmit }) => (
        <Flex
          flexDirection="column"
          width="100wh"
          height="100vh"
          backgroundColor="gray.200"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            flexDir="column"
            mb="2"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              boxSize="100px"
              objectFit="cover"
              src={logo}
              alt="myDaily-logo"
              borderRadius="full"
            />

            <Heading color="teal.400">Reset Password</Heading>
            <Box minW={{ base: "90%", md: "468px" }}>
              <form onSubmit={handleSubmit}>
                <Stack
                  spacing={4}
                  p="1rem"
                  backgroundColor="whiteAlpha.900"
                  boxShadow="md"
                >
                  <Field
                    name="password"
                    render={({ field, form: { touched, errors } }) => (
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <CFaLock color="gray.300" />
                          </InputLeftElement>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              h="1.75rem"
                              size="sm"
                              onClick={handleShowClick}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        {touched[field.name] && errors[field.name] && (
                          <Text color="tomato" fontSize="xs">
                            {errors[field.name]}
                          </Text>
                        )}
                      </FormControl>
                    )}
                  />
                  <Field
                    name="confirmPassword"
                    render={({ field, form: { touched, errors } }) => (
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <CFaLock color="gray.300" />
                          </InputLeftElement>
                          <Input
                            {...field}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            type={confirmShowPassword ? "text" : "password"}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              h="1.75rem"
                              size="sm"
                              onClick={handleConfirmShowClick}
                            >
                              {confirmShowPassword ? "Hide" : "Show"}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        {touched[field.name] && errors[field.name] && (
                          <Text color="tomato" fontSize="xs">
                            {errors[field.name]}
                          </Text>
                        )}
                      </FormControl>
                    )}
                  />
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="teal"
                    width="full"
                    //disabled={isLoading}
                  >
                    Reset Password
                  </Button>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      )}
    </Formik>
  );
};

export default ResetPassword;

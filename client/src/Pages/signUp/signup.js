import { useEffect, useState } from "react";
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
  Link,
  FormControl,
  InputRightElement,
  Image,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { FaUserAlt, FaLock, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/img/mydailyLogo.png";
import { signupUser } from "../../redux/features/signup/signupThunk";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaFaUserCircle = chakra(FaUserCircle);

const FormSchema = yup.object().shape({
  username: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const { isLoading, error, user } = useSelector((state) => state.signup);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }

    if (user) {
      toast({
        title: "User registered successfully!",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
      navigate("/", { replace: true });
    }
  }, [error, user]);

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleConfirmShowClick = () =>
    setConfirmShowPassword(!confirmShowPassword);

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        dispatch(signupUser(values));
      }}
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

            <Heading color="teal.400">Connect with us</Heading>
            <Box minW={{ base: "90%", md: "468px" }}>
              <form onSubmit={handleSubmit}>
                {/* <Form> */}
                <Stack
                  spacing={4}
                  p="1rem"
                  backgroundColor="whiteAlpha.900"
                  boxShadow="md"
                >
                  <Field
                    name="username"
                    render={({ field, form: { touched, errors } }) => (
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <CFaFaUserCircle color="gray.300" />
                          </InputLeftElement>
                          <Input
                            {...field}
                            type="text"
                            name="username"
                            placeholder="username"
                          />
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
                    name="email"
                    render={({ field, form: { touched, errors } }) => (
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <CFaUserAlt color="gray.300" />
                          </InputLeftElement>
                          <Input
                            {...field}
                            type="email"
                            name="email"
                            placeholder="Email address"
                          />
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
                    disabled={isLoading}
                  >
                    Sign up
                  </Button>
                  {isLoading && (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                    />
                  )}
                </Stack>
                {/* </Form> */}
              </form>
            </Box>
          </Stack>
          <Box>
            Already have an account?{" "}
            <Link color="teal.500" href="/">
              Login
            </Link>
          </Box>
        </Flex>
      )}
    </Formik>
  );
};

export default SignUp;

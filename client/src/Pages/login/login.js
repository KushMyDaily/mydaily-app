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
  FormHelperText,
  InputRightElement,
  Image,
  Spinner,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { FaUserAlt, FaLock } from "react-icons/fa";
import logo from "../../assets/img/mydailyLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { signinUser } from "../../redux/features/signin/signinThunk";
import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const FormSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, error, user, isAuthenticated } = useSelector(
    (state) => state.signin,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleShowClick = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
    if (user && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, error]);

  return (
    <>
      {user && isAuthenticated ? (
        <p>loading...</p>
      ) : (
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={FormSchema}
          onSubmit={(values) => {
            setTimeout(() => {
              dispatch(signinUser(values));
            }, 1500);
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

                <Heading color="teal.400">Welcome</Heading>
                <Box minW={{ base: "90%", md: "468px" }}>
                  <form onSubmit={handleSubmit}>
                    <Stack
                      spacing={4}
                      p="1rem"
                      backgroundColor="whiteAlpha.900"
                      boxShadow="md"
                    >
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
                            <FormHelperText textAlign="right">
                              <Link>forgot password?</Link>
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                      <Button
                        borderRadius={0}
                        type="submit"
                        variant="solid"
                        colorScheme="teal"
                        width="full"
                      >
                        Login
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
                  </form>
                </Box>
              </Stack>
              <Box>
                New to us?{" "}
                <Link color="teal.500" href="/signup">
                  Sign Up
                </Link>
              </Box>
            </Flex>
          )}
        </Formik>
      )}
    </>
  );
};

export default Login;

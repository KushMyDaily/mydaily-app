import { useEffect } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  Spinner,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  clearDataResetPassword,
} from "../../redux/features/signin/signinThunk";

const CFaUserAlt = chakra(FaUserAlt);
const FormSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
});

const FogotPassword = () => {
  const { isLoadingResetPassword, resettedPassword, errorResetPassword } =
    useSelector((state) => state.signin);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(clearDataResetPassword());
  }, []);

  useEffect(() => {
    if (errorResetPassword !== null) {
      toast({
        title: errorResetPassword,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
      dispatch(clearDataResetPassword());
    }
  }, [isLoadingResetPassword, resettedPassword, errorResetPassword]);

  return (
    <>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={FormSchema}
        onSubmit={(values) => {
          setTimeout(() => {
            dispatch(resetPassword(values));
          }, 1000);
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
            {!isLoadingResetPassword && resettedPassword !== null ? (
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                width="800px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Check your email
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  {resettedPassword && resettedPassword.data}
                </AlertDescription>
              </Alert>
            ) : (
              <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
              >
                <Heading color="teal.400" mb={12}>
                  Forgot Password?
                </Heading>
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
                      <Button
                        borderRadius={0}
                        type="submit"
                        variant="solid"
                        colorScheme="teal"
                        width="full"
                      >
                        Send Reset Token
                      </Button>
                      {isLoadingResetPassword && (
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
            )}
            <Box>
              Go back?{" "}
              <Link color="teal.500" href="/">
                Sign In
              </Link>
            </Box>
          </Flex>
        )}
      </Formik>
    </>
  );
};

export default FogotPassword;

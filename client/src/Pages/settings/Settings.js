import {
  Alert,
  AlertIcon,
  AlertDescription,
  Avatar,
  Box,
  Card,
  CardBody,
  Text,
  Flex,
  Input,
  Textarea,
  Select,
  Button,
  Image,
  useToast,
  Spinner,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import React, { useEffect, useState } from "react";
import { FaRegFrown } from "react-icons/fa";
import { Formik, Field } from "formik";
import PageHeader from "../../comps/PageHeader";
import ImageUpload from "../../comps/ImageUpload";
import styles from "./settings.module.css";

import { signOutUser } from "../../redux/features/signin/signinThunk";
import { google } from "../../redux/features/google/googleThunk";
import {
  checkSocialAuth,
  updateProfile,
  getProfile,
  sendConcern,
} from "../../redux/features/user/userThunk";
import { useDispatch, useSelector } from "react-redux";
import slackLogo from "../../assets/slack.png";
import googleLogo from "../../assets/google.png";
import mydailyLogo from "../../assets/img/mydailyLogo.png";

import CustomDatePicker from "../../comps/CustomDatePicker";

import "react-datepicker/dist/react-datepicker.css";

// const customStyles = {
//   redBorder: {
//     border: "1px solid red",
//   },
// };
// const GOOGLE_CLIENT_ID =
//   "82428000378-qgiakmtoq94ovgrjtja4bistjten4kgm.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";
// const SCOPES =
// "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly";

function Settings() {
  //const [user, setUser] = useState({});
  //const [codeClient, setCodeClient] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [concernText, setConcernText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { user } = useSelector((state) => state.signin);
  const { url, error } = useSelector((state) => state.google);
  const {
    socialAuth,
    userDetails,
    updateUserProfileIsLoading,
    userConcernsIsLoading,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (url) {
      window.location.replace(url);
    }

    if (error) {
      toast({
        title: error,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  }, [url, error]);

  useEffect(() => {
    dispatch(checkSocialAuth(user.id));
    dispatch(getProfile(user.id));
  }, []);

  const handleImageUpload = (imageDataURL) => {
    setUploadedImage(imageDataURL);
  };

  // function handleCallbackResponse(response) {
  //   // eslint-disable-next-line no-console
  //   console.log("Encoded JWT ID token: " + response.credential);
  //   // var userObject = jwt_decode(response.credential)
  //   //console.log(userObject)
  //   // setUser(userObject)
  // }

  const getCode = () => {
    dispatch(google({ userId: user.id }));
  };

  const handleSendConcern = () => {
    dispatch(
      sendConcern({
        userId: user.id,
        concern: concernText,
      }),
    ).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        toast({
          title: "Concern sent successfully",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: data.payload.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      }
    });
  };

  // function getTokens(response) {
  //   var authorizationCode = response.code;
  //   exchangeAuthorizationCode(authorizationCode);
  // }

  // const exchangeAuthorizationCode = async (authorizationCode) => {
  //   const tokenEndpoint = "https://oauth2.googleapis.com/token";
  //   const clientId = GOOGLE_CLIENT_ID;
  //   const clientSecret = GOOGLE_CLIENT_SECRET;
  //   const redirectUri = "http://localhost:3000";

  //   const requestBody = new URLSearchParams();
  //   requestBody.append("code", authorizationCode);
  //   requestBody.append("client_id", clientId);
  //   requestBody.append("client_secret", clientSecret);
  //   requestBody.append("redirect_uri", redirectUri);
  //   requestBody.append("grant_type", "authorization_code");

  //   try {
  //     const response = await fetch(tokenEndpoint, {
  //       method: "POST",
  //       body: requestBody,
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to exchange authorization code for tokens");
  //     }

  //     // const tokenData = await response.json();
  //     // const accessToken = tokenData.access_token;
  //     // const refreshToken = tokenData.refresh_token;
  //     //const currentUser = await Auth.currentAuthenticatedUser();

  //     // const createGoogleToken = `
  //     //     mutation CreateGoogleToken(
  //     //       $input: CreateGoogleTokenInput!
  //     //     ) {
  //     //       createGoogleToken(input: $input) {
  //     //         userEmail
  //     //         accessToken
  //     //         refreshToken
  //     //         expirationDate
  //     //       }
  //     //     }
  //     // `;

  //     // Compute the expiration date 1 hour from now
  //     let expirationDate = new Date();
  //     expirationDate.setHours(expirationDate.getHours() + 1);

  //     // Prepare the token record for saving to DynamoDB via AppSync/GraphQL
  //     // const tokenRecord = {
  //     //   // userEmail: currentUser.attributes.email, // assuming you have the user's email at this point
  //     //   accessToken: accessToken,
  //     //   refreshToken: refreshToken,
  //     //   expirationDate: expirationDate.toISOString(), // ISO format includes date, time, and timezone
  //     // };

  //     try {
  //       // await API.graphql(graphqlOperation(createGoogleToken, { input: tokenRecord }));
  //     } catch (error) {
  //       // console.error("Error saving token to database:", error);
  //     }
  //   } catch (error) {
  //     // console.error("Error exchanging authorization code:", error);
  //   }
  // };

  // useEffect(() => {
  //   /* global */
  //   // const google = window.google;

  //   window.google?.accounts?.id.initialize({
  //     client_id: GOOGLE_CLIENT_ID,
  //     callback: handleCallbackResponse,
  //   });

  //   window.google?.accounts?.id.renderButton(
  //     document.getElementById("signInDiv"),
  //     {
  //       theme: "outline",
  //       size: "large",
  //     },
  //   );

  //   // Code Client for Refresh Token
  //   // setCodeClient(
  //   //   window.google?.accounts?.oauth2.initCodeClient({
  //   //     client_id: GOOGLE_CLIENT_ID,
  //   //     scope: SCOPES,
  //   //     ux_mode: "popup",
  //   //     callback: getTokens,
  //   //   }),
  //   // );

  //   window.google?.accounts?.id.prompt();
  // }, []);

  const signOut = async () => {
    try {
      await dispatch(
        signOutUser({
          refreshToken: JSON.parse(localStorage.getItem("refreshToken")),
        }),
      );
    } catch (error) {
      null;
    }
  };

  return (
    <Box>
      <PageHeader
        pageName="Setting"
        isInfoIcon={false}
        title={"General Settings"}
        subTitle={""}
      />
      <Card className={styles.settingCard} boxShadow={"none"} mt={4}>
        <CardBody className={styles.settingCard}>
          <Button
            className={styles.signOutBtn}
            variant="link"
            position={"absolute"}
            top={25}
            right={30}
            onClick={signOut}
          >
            Sign Out
          </Button>
          <Flex
            maxW="1210"
            pt={7}
            pd={16}
            pl={10}
            pr={10}
            flexWrap={"wrap"}
            margin={"0 auto"}
            justifyContent={"space-between"}
          >
            <Box width={"100%"} textAlign={"center"} mb={3}>
              {uploadedImage ? (
                <Avatar
                  name="Uploaded Preview"
                  src={uploadedImage}
                  size={"xl"}
                  mb={3.5}
                />
              ) : (
                <Avatar
                  name="Ryan Florence"
                  src="https://bit.ly/ryan-florence"
                  size={"xl"}
                  mb={3.5}
                />
              )}
              <ImageUpload onImageUpload={handleImageUpload} />
            </Box>
            <Box width={"50%"} maxWidth={"470px"} pr={5}>
              <Formik
                initialValues={{
                  username: userDetails ? userDetails.username : "",
                  fullName: userDetails ? userDetails.fullname : "",
                  birthday: userDetails ? userDetails.birthday : "",
                  manager:
                    userDetails && userDetails.Managers
                      ? userDetails.Managers[0]?.fullname
                      : "",
                  position: userDetails ? userDetails.position : "",
                  gender: userDetails ? userDetails.gender : "",
                }}
                enableReinitialize
                //validationSchema={FormSchema}
                onSubmit={(values) => {
                  dispatch(updateProfile({ userid: user.id, ...values }));
                }}
              >
                {({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    {/* <Form> */}
                    <Box mb={5}>
                      <Text color={"#606060"} pb={3} fontSize={"sm"}>
                        Username
                      </Text>
                      <Field
                        id="username"
                        name="username"
                        placeholder="username"
                        render={({ field, form: { touched, errors } }) => (
                          <div>
                            <Input
                              {...field}
                              placeholder="Enter your username"
                              size={"lg"}
                              bg={"#F5F6FA"}
                              fontSize={"sm"}
                              border={"1px solid #D5D5D5"}
                              borderRadius={10}
                            />
                            {touched[field.name] && errors[field.name] && (
                              <Text color="tomato" fontSize="xs">
                                {errors[field.name]}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                    </Box>
                    <Box mb={5}>
                      <Text color={"#606060"} pb={3} fontSize={"sm"}>
                        Full Name
                      </Text>
                      <Field
                        id="fullName"
                        name="fullName"
                        placeholder="Full Name"
                        render={({ field, form: { touched, errors } }) => (
                          <div>
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              size={"lg"}
                              bg={"#F5F6FA"}
                              fontSize={"sm"}
                              border={"1px solid #D5D5D5"}
                              borderRadius={10}
                            />
                            {touched[field.name] && errors[field.name] && (
                              <Text color="tomato" fontSize="xs">
                                {errors[field.name]}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                    </Box>
                    <Box mb={5}>
                      <Text color={"#606060"} pb={3} fontSize={"sm"}>
                        Manager
                      </Text>
                      <Field
                        id="manager"
                        name="manager"
                        placeholder="manager"
                        render={({ field, form: { touched, errors } }) => (
                          <div>
                            <Input
                              {...field}
                              size={"lg"}
                              bg={"#F5F6FA"}
                              fontSize={"sm"}
                              border={"1px solid #D5D5D5"}
                              borderRadius={10}
                              disabled
                            />
                            {touched[field.name] && errors[field.name] && (
                              <Text color="tomato" fontSize="xs">
                                {errors[field.name]}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                    </Box>
                    <Box mb={5}>
                      <Text color={"#606060"} pb={3} fontSize={"sm"}>
                        Birthday
                      </Text>
                      <Field
                        id="birthday"
                        name="birthday"
                        placeholder="birthday"
                        render={({
                          field,
                          form: { touched, errors, setFieldValue },
                        }) => (
                          <div>
                            <CustomDatePicker
                              {...field}
                              initialDate={field.value || new Date()}
                              onChange={(val) => {
                                setFieldValue(field.name, val);
                              }}
                            />
                            {touched[field.name] && errors[field.name] && (
                              <Text color="tomato" fontSize="xs">
                                {errors[field.name]}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                    </Box>
                    <Box mb={5}>
                      <Text color={"#606060"} pb={3} fontSize={"sm"}>
                        Position
                      </Text>
                      <Field
                        id="position"
                        name="position"
                        placeholder="position"
                        render={({ field, form: { touched, errors } }) => (
                          <div>
                            <Input
                              {...field}
                              placeholder="Enter your position"
                              size={"lg"}
                              bg={"#F5F6FA"}
                              fontSize={"sm"}
                              border={"1px solid #D5D5D5"}
                              borderRadius={10}
                            />
                            {touched[field.name] && errors[field.name] && (
                              <Text color="tomato" fontSize="xs">
                                {errors[field.name]}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                    </Box>
                    <Box mb={5}>
                      <Text color={"#606060"} pb={3} fontSize={"sm"}>
                        Gender
                      </Text>
                      <Field
                        id="gender"
                        name="gender"
                        placeholder="gender"
                        render={({ field, form: { touched, errors } }) => (
                          <div>
                            <Select
                              {...field}
                              placeholder="Select your gender"
                              size={"lg"}
                              bg={"#F5F6FA"}
                              fontSize={"sm"}
                              border={"1px solid #D5D5D5"}
                              borderRadius={10}
                              width={"50%"}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Select>
                            {touched[field.name] && errors[field.name] && (
                              <Text color="tomato" fontSize="xs">
                                {errors[field.name]}
                              </Text>
                            )}
                          </div>
                        )}
                      />
                    </Box>
                    <Box width={"100%"} mt={4}>
                      {updateUserProfileIsLoading && (
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="blue.500"
                        />
                      )}
                      <Button
                        className={styles.updatedbtn}
                        variant="solid"
                        w={"100%"}
                        display={"block"}
                        mx={"auto"}
                        borderRadius={10}
                        type="submit"
                      >
                        Update Now
                      </Button>
                    </Box>
                    {/* </Form> */}
                  </form>
                )}
              </Formik>
            </Box>

            <Box width={"50%"} maxWidth={"470px"} pl={5}>
              {socialAuth && socialAuth.hasSlack ? (
                <Alert status="success" variant="subtle" width={"60%"} mb={5}>
                  <AlertIcon />
                  <Image src={slackLogo} style={{ width: "25px" }} />
                  <AlertDescription p={2}>Slack connected</AlertDescription>
                </Alert>
              ) : (
                <Button
                  className={styles.slackBtn}
                  colorScheme="white"
                  variant="solid"
                  mt={5}
                  w={"60%"}
                  p={"0 15px"}
                  justifyContent={"flex-start"}
                  leftIcon={<Image src={slackLogo} style={{ width: "25px" }} />}
                  onClick={() =>
                    (location.href =
                      "https://slack.com/oauth/v2/authorize?client_id=4578727160275.4581313497012&scope=channels:history,channels:read,chat:write,commands,conversations.connect:manage,conversations.connect:read,conversations.connect:write,groups:history,groups:read,im:history,users:read,users:read.email,channels:write.invites,groups:write.invites,mpim:write.invites,channels:manage,groups:write,im:write,mpim:write&user_scope=channels:write,channels:write.invites")
                  }
                  isDisabled={socialAuth && socialAuth.hasSlack}
                >
                  Add to Slack
                </Button>
              )}

              {socialAuth && socialAuth.hasGoogle ? (
                <Alert status="success" variant="subtle" width={"60%"} mb={5}>
                  <AlertIcon />
                  <Image src={googleLogo} style={{ width: "25px" }} />
                  <AlertDescription p={2}>Google connected</AlertDescription>
                </Alert>
              ) : (
                <Button
                  className={styles.googleBtn}
                  colorScheme="white"
                  variant="solid"
                  mt={5}
                  w={"60%"}
                  p={"0 15px"}
                  justifyContent={"flex-start"}
                  leftIcon={
                    <Image src={googleLogo} style={{ width: "25px" }} />
                  }
                  onClick={getCode}
                  isDisabled={socialAuth && socialAuth.hasGoogle}
                >
                  Connect
                </Button>
              )}

              <Button
                className={styles.reachBtn}
                colorScheme="black"
                variant="solid"
                mt={5}
                w={"60%"}
                p={"0 15px"}
                justifyContent={"flex-start"}
                leftIcon={<Image src={mydailyLogo} style={{ width: "25px" }} />}
                isDisabled={true}
              >
                Reach out to us
              </Button>

              <Button
                className={styles.conflictManagerBtn}
                colorScheme="pink"
                variant="solid"
                mt={5}
                w={"60%"}
                p={"0 15px"}
                justifyContent={"flex-start"}
                leftIcon={
                  <Icon fontSize="23px" color={"#000"}>
                    <FaRegFrown />
                  </Icon>
                }
                ref={btnRef}
                onClick={onOpen}
              >
                Manager Conflict
              </Button>
              {/*<input type="submit" onClick={getCode} value="Get Events"/>*/}
            </Box>
          </Flex>
        </CardBody>
      </Card>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Incorrect Manager Name?</DrawerHeader>

          <DrawerBody>
            <Text mb={5}>
              Does this manager&apos;s name look incorrect? Let us know if you
              have any concerns.
            </Text>
            <Textarea
              placeholder="Type here your concerns..."
              h="500px"
              onChange={(e) => setConcernText(e.target.value)}
            />
          </DrawerBody>

          <DrawerFooter>
            {userConcernsIsLoading && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
              />
            )}
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>

            <Button
              colorScheme="pink"
              variant="solid"
              isDisabled={concernText === ""}
              onClick={() => handleSendConcern(concernText)}
            >
              Send
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Settings;

import {
  Avatar,
  Box,
  Card,
  CardBody,
  Text,
  Flex,
  Input,
  Select,
  Button,
  Image,
} from "@chakra-ui/react";
import React from "react";
import PageHeader from "../../comps/PageHeader";
import ImageUpload from "../../comps/ImageUpload";
import styles from "./settings.module.css";

import { useEffect, useState } from "react";
import { signOutUser } from "../../redux/features/signin/signinThunk";
import { useDispatch } from "react-redux";

const GOOGLE_CLIENT_ID =
  "82428000378-qgiakmtoq94ovgrjtja4bistjten4kgm.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const SCOPES =
  "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly";

function Settings() {
  //const [user, setUser] = useState({});
  const [codeClient, setCodeClient] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);

  const dispatch = useDispatch();

  const handleImageUpload = (imageDataURL) => {
    setUploadedImage(imageDataURL);
  };

  function handleCallbackResponse(response) {
    // eslint-disable-next-line no-console
    console.log("Encoded JWT ID token: " + response.credential);
    // var userObject = jwt_decode(response.credential)
    //console.log(userObject)
    // setUser(userObject)
  }

  function getCode() {
    codeClient.requestCode();
  }

  function getTokens(response) {
    var authorizationCode = response.code;
    exchangeAuthorizationCode(authorizationCode);
  }

  const exchangeAuthorizationCode = async (authorizationCode) => {
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const clientId = GOOGLE_CLIENT_ID;
    const clientSecret = GOOGLE_CLIENT_SECRET;
    const redirectUri = "http://localhost:3000";

    const requestBody = new URLSearchParams();
    requestBody.append("code", authorizationCode);
    requestBody.append("client_id", clientId);
    requestBody.append("client_secret", clientSecret);
    requestBody.append("redirect_uri", redirectUri);
    requestBody.append("grant_type", "authorization_code");

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        body: requestBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to exchange authorization code for tokens");
      }

      // const tokenData = await response.json();
      // const accessToken = tokenData.access_token;
      // const refreshToken = tokenData.refresh_token;
      //const currentUser = await Auth.currentAuthenticatedUser();

      // const createGoogleToken = `
      //     mutation CreateGoogleToken(
      //       $input: CreateGoogleTokenInput!
      //     ) {
      //       createGoogleToken(input: $input) {
      //         userEmail
      //         accessToken
      //         refreshToken
      //         expirationDate
      //       }
      //     }
      // `;

      // Compute the expiration date 1 hour from now
      let expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);

      // Prepare the token record for saving to DynamoDB via AppSync/GraphQL
      // const tokenRecord = {
      //   // userEmail: currentUser.attributes.email, // assuming you have the user's email at this point
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
      //   expirationDate: expirationDate.toISOString(), // ISO format includes date, time, and timezone
      // };

      try {
        // await API.graphql(graphqlOperation(createGoogleToken, { input: tokenRecord }));
      } catch (error) {
        // console.error("Error saving token to database:", error);
      }
    } catch (error) {
      // console.error("Error exchanging authorization code:", error);
    }
  };

  useEffect(() => {
    /* global */
    // const google = window.google;

    window.google?.accounts?.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    window.google?.accounts?.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "outline",
        size: "large",
      },
    );

    // Code Client for Refresh Token
    setCodeClient(
      window.google?.accounts?.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        ux_mode: "popup",
        callback: getTokens,
      }),
    );

    window.google?.accounts?.id.prompt();
  }, []);

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
              <Box mb={5}>
                <Text color={"#606060"} pb={3} fontSize={"sm"}>
                  First Name
                </Text>
                <Input
                  placeholder="Enter your first name"
                  size={"lg"}
                  bg={"#F5F6FA"}
                  fontSize={"sm"}
                  border={"1px solid #D5D5D5"}
                  borderRadius={10}
                />
              </Box>
              <Box mb={5}>
                <Text color={"#606060"} pb={3} fontSize={"sm"}>
                  Last Name
                </Text>
                <Input
                  placeholder="Enter your last name"
                  size={"lg"}
                  bg={"#F5F6FA"}
                  fontSize={"sm"}
                  border={"1px solid #D5D5D5"}
                  borderRadius={10}
                />
              </Box>
              <Box mb={5}>
                <Text color={"#606060"} pb={3} fontSize={"sm"}>
                  Your Email
                </Text>
                <Input
                  placeholder="Enter your email"
                  size={"lg"}
                  bg={"#F5F6FA"}
                  fontSize={"sm"}
                  border={"1px solid #D5D5D5"}
                  borderRadius={10}
                />
              </Box>
              <Box mb={5}>
                <Text color={"#606060"} pb={3} fontSize={"sm"}>
                  Your Position
                </Text>
                <Input
                  placeholder="Enter your position"
                  size={"lg"}
                  bg={"#F5F6FA"}
                  fontSize={"sm"}
                  border={"1px solid #D5D5D5"}
                  borderRadius={10}
                />
              </Box>
              <Box>
                <Text color={"#606060"} pb={3} fontSize={"sm"}>
                  Gender
                </Text>
                <Select
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
              </Box>
            </Box>
            <Box width={"50%"} maxWidth={"470px"} pl={5}>
              {/*<div id="signInDiv"></div>*/}
              <Button
                className={styles.reachBtn}
                colorScheme="black"
                variant="solid"
                mt={5}
                w={"100%"}
                p={"0 15px"}
                justifyContent={"flex-start"}
                leftIcon={<Image src="../images/mydailylogo.png" />}
              >
                Reach out to us
              </Button>
              <Button
                className={styles.googleBtn}
                colorScheme="white"
                variant="solid"
                mt={5}
                w={"100%"}
                p={"0 15px"}
                justifyContent={"flex-start"}
                leftIcon={<Image src="../images/googlelogo.png" />}
                onClick={getCode}
              >
                Connect
              </Button>
              {/*<input type="submit" onClick={getCode} value="Get Events"/>*/}
            </Box>
            <Box width={"100%"} mt={4}>
              <Button
                className={styles.updatedbtn}
                variant="solid"
                w={"100%"}
                display={"block"}
                mx={"auto"}
                borderRadius={10}
              >
                Update Now
              </Button>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Settings;

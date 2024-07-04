import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Spinner,
  useToast,
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  CardFooter,
  Button,
} from "@chakra-ui/react";

function GoogleRedirect() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  let [searchParams] = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    // Extract the parameter from the original URL
    const code = searchParams.get("code");
    const user = JSON.parse(localStorage.getItem("user"));

    const userId = parseInt(user?.id);
    setUser(user);

    if (code) {
      // Construct the new URL with the extracted parameter
      const url = `${process.env.REACT_APP_API_BASE_URL}/redirect?code=${code}&user=${userId}`;

      // Fetch data from the new URL
      axios
        .get(url)
        .then((response) => {
          setData(response);
        })
        .catch((err) => {
          setError(err);
        });
    } else {
      setError("code not found in the URL.");
    }
  }, [searchParams]);

  if (error) {
    toast({
      title: error.message || error,
      status: "error",
      position: "top-right",
      isClosable: true,
    });
  }

  if (!data) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <Box bg="#ab5dd9" pb={8} align="center" height="100vh">
      {data.status === 200 && (
        <Heading color="brand.text" fontFamily="heading" py={8}>
          {user?.username}
        </Heading>
      )}
      <Card maxW={80} align="center">
        <CardHeader>
          <Heading size="xl">
            {data.status === 200 ? "Authenticated" : "Oops.. Failed"}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text fontFamily="body">
            {data.status === 200
              ? "Your google account successfully authenticated."
              : "Something went wrong"}
          </Text>
        </CardBody>
        <CardFooter>
          <Link to={"/settings"}>
            <Button
              bg="#ab5dd9"
              color="#ffffff"
              px={8}
              py={4}
              size="xl"
              variant="with-shadow"
            >
              Go Back
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Box>
  );
}

export default GoogleRedirect;

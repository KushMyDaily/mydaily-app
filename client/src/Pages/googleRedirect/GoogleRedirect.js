import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function GoogleRedirect() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  let [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract the parameter from the original URL
    const code = searchParams.get("code");
    const user = JSON.parse(localStorage.getItem("user"));

    const userId = parseInt(user?.id);
    setUser(user);

    if (code) {
      // Construct the new URL with the extracted parameter
      const url = `${process.env.API_BASE_URL}/redirect?code=${code}&user=${userId}`;

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
    return <div>Error: {error.message || error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.status === 200 ? (
        <h1>{`Hi ${user?.username}, Your google account successfully authenticated`}</h1>
      ) : (
        <h2>Something went wrong</h2>
      )}
    </div>
  );
}

export default GoogleRedirect;

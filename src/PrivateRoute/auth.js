//auth.js

import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; // Correct import

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token"); // or get token from cookies

      console.log("token is: ", token);
      if (!token) {
        setIsLoggedIn(false);
      } else setIsLoggedIn(true);

      //   try {
      //     const decodedToken = jwt_decode(token); // Decode the token
      //     const currentTime = Date.now() / 1000; // Convert current time to seconds

      //     if (decodedToken.exp < currentTime) {
      //       // If token is expired
      //       localStorage.removeItem("token"); // Clear expired token
      //       setIsLoggedIn(false);
      //     } else {
      //       // Token is valid
      //       setIsLoggedIn(true);
      //     }
      //   } catch (error) {
      //     console.error("Error decoding token:", error);
      //     setIsLoggedIn(false); // If there's an error decoding, assume not logged in
      //   }
    };

    checkAuth();
  }, []); // Run only once when the component mounts

  return isLoggedIn;
}

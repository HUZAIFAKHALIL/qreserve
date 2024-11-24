// import { createContext, useContext, useEffect } from "react";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [email, setEmail] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const authInfo = {
//     email,
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

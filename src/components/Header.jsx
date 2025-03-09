// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useAuth } from "@/PrivateRoute/auth";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import SearchAndFilter from "./SearchAndFilter";


// const buyerRoutes = [
//   { name: "Profile", path: "/profile" },
//   { name: "Pending Reservations", path: "/pending-reservations" },
//   { name: "Confirmed Reservations", path: "/confirmed-reservations" },
// ];

// const sellerRoutes = [
//   { name: "Post a Service", path: "/addService" }
// ];

// const Header = () => {
//   const isLoggedIn = useAuth();
//   const router = useRouter();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [loggedIn, setLoggedIn] = useState(isLoggedIn);
//   const [userEmail, setUserEmail] = useState("");
//   const [userRole,setUserRole] = useState("")
//   const [searchValue, setSearchValue] = useState("");

//   useEffect(() => {
//     setUserEmail(localStorage.getItem("userEmail") || "");
//     setUserRole(localStorage.getItem("userRole"))
//   }, []);

//   const handleLogOut = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userRole")
//     router.push("/");
//     setLoggedIn(false);
//     setMenuOpen(false);
//     setUserEmail("");
//     setUserRole("");

//   };

//   const toggleMenu = () => setMenuOpen((prev) => !prev);

//   const handleSearch = () => {
//     if (!searchValue.trim()) return alert("Please enter a search term");
//     router.push(`/search?query=${searchValue}`);
//   };

//   return (
//     <header className="bg-white p-4 shadow-2xl border-b">
//       <div className="flex items-center justify-between">
//         {/* Logo */}
//         <Link className="flex items-center space-x-2" href="/">
//           <Image
//             src="/images/qReserve_Logo.png"
//             alt="Logo"
//             width={300}
//             height={50}
//             className="h-12" // Ensure consistent height
//           />
//         </Link>

//         {/* Search Component */}
//         {userRole=='BUYER' && <SearchAndFilter />}

//         {/* Account Menu */}
//         <div className="flex items-center space-x-4 w-[300px]">
//           {userEmail ? (
//             <div className="absolute z-10">
//               <div
//                 className="flex items-center space-x-2 cursor-pointer "
//                 onClick={toggleMenu}
//               >
//                 <span>{userEmail}</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-6 h-6"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
//                   />
//                 </svg>
//               </div>
//               {menuOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border">
//                  {userRole=='BUYER'? buyerRoutes.map((route, index) => (
//                     <Link
//                       key={index}
//                       href={route.path}
//                       className="block px-4 py-2 text-black hover:bg-gray-100"
//                     >
//                       {route.name}
//                     </Link>
//                   )) :
//                   userRole=='SELLER' ? sellerRoutes.map((route, index) => (
//                     <Link
//                       key={index}
//                       href={route.path}
//                       className="block px-4 py-2 text-black hover:bg-gray-100"
//                     >
//                       {route.name}
//                     </Link>
//                   )) : ""
//                 } 

//                   <button
//                     onClick={handleLogOut}
//                     className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link
//               className="bg-black text-white py-2 px-6 rounded-lg h-12 flex items-center"
//               href="/login"
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



//huzaifa code


"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/PrivateRoute/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchAndFilter from "./SearchAndFilter";

const buyerRoutes = [
  { name: "Profile", path: "/profile" },
  { name: "Pending Reservations", path: "/pending-reservations" },
  { name: "Confirmed Reservations", path: "/confirmed-reservations" },
];

const sellerRoutes = [
  { name: "Post a Service", path: "/addService" }
];

const Header = () => {
  const isLoggedIn = useAuth(); // Directly use the hook's value
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Update user data when auth state changes
  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail") || "");
    setUserRole(localStorage.getItem("userRole") || "");
  }, [isLoggedIn]); 

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    router.push("/");
    setMenuOpen(false);
    // Clear local state immediately
    setUserEmail("");
    setUserRole("");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSearch = () => {
    if (!searchValue.trim()) return alert("Please enter a search term");
    router.push(`/search?query=${searchValue}`);
  };

  return (
    <header className="bg-white p-4 shadow-2xl border-b">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center space-x-2" href="/">
          <Image
            src="/images/qReserve_Logo.png"
            alt="Logo"
            width={300}
            height={50}
            className="h-12"
          />
        </Link>

        {/* Search Component */}
        {userRole === 'BUYER' && <SearchAndFilter />}

        {/* Account Menu */}
        <div className="flex items-center space-x-4 w-[300px]">
          {userEmail ? (
            <div className="absolute z-10">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleMenu}
              >
                <span>{userEmail}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border">
                  {(userRole === 'BUYER' ? buyerRoutes : userRole === 'SELLER' ? sellerRoutes : []).map((route, index) => (
                    <Link
                      key={index}
                      href={route.path}
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      {route.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogOut}
                    className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              className="bg-black text-white py-2 px-6 rounded-lg h-12 flex items-center"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
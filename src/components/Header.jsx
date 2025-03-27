// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useAuth } from "@/PrivateRoute/auth";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import SearchAndFilter from "./SearchAndFilter";
// import LoyaltyDiscountBadge from "./LoyaltyDiscountBadge";

// const buyerRoutes = [
//   { name: "Profile", path: "/profile" },
//   { name : "Reservations" , path : "/reservations"}
// ];

// const sellerRoutes = [
//   { name: "Post a Service", path: "/addService" }
// ];

// const Header = () => {
//   const isLoggedIn = useAuth(); // Directly use the hook's value
//   const router = useRouter();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [searchValue, setSearchValue] = useState("");

//   // Update user data when auth state changes
//   useEffect(() => {
//     setUserEmail(localStorage.getItem("name") || "");
//     setUserRole(localStorage.getItem("userRole") || "");
//   }, [isLoggedIn]); 

//   const handleLogOut = () => {
//     console.log("Logging out...");
//     localStorage.removeItem("token");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("name");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userRole");
//     console.log("Local storage cleared.");
  
//     // Check if items are cleared
//     console.log("User email:", localStorage.getItem("userEmail"));
//     console.log("User role:", localStorage.getItem("userRole"));
     
//     router.push("/");
//     setMenuOpen(false);
//     setUserEmail("");
//     setUserRole("");
//     window.location.reload(); 
//   };
//   const toggleMenu = () => setMenuOpen((prev) => !prev);

//   const handleSearch = () => {
//     if (!searchValue.trim()) return alert("Please enter a search term");
//     router.push(`/search?query=${searchValue}`);
//   };

//   // Function to get initials from name
//   const getInitials = (name) => {
//     if (!name) return "";
//     return name
//       .split(" ")
//       .map(part => part[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2); // Limit to 2 characters
//   };

//   return (
//     <header className="bg-white p-4 shadow-2xl border-b">
//       <div className="flex items-center justify-between">
//         {/* Logo */}
//         <Link className="flex items-center space-x-2" href="/">
//           <Image
//             src="/images/qReserve_Logo.png"
//             alt="Logo"
//             width={320}
//             height={80}
//             className="h-12"
//           />
//         </Link>

//         {/* Search Component */}
//         <div className="flex-1 flex items-center justify-center gap-4 max-w-2xl mx-4">
//             {userRole === 'BUYER' && (
//               <>
//                 <SearchAndFilter />
//                 <LoyaltyDiscountBadge />
//               </>
//             )}
//           </div>

//         <div className="flex items-center space-x-4 w-[300px]">
//           {userEmail ? (
//             <div className="absolute z-10">
//               <div
//                 className="flex items-center space-x-2 cursor-pointer"
//                 onClick={toggleMenu}
//               >
//                 <span>{userEmail}</span>
//                 <div className="flex items-center justify-center bg-gray-200 rounded-full w-8 h-8 text-sm font-medium text-gray-700">
//                   {getInitials(userEmail)}
//                 </div>
//               </div>
//               {menuOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border">
//                   {(userRole === 'BUYER' ? buyerRoutes : userRole === 'SELLER' ? sellerRoutes : []).map((route, index) => (
//                     <Link
//                       key={index}
//                       href={route.path}
//                       className="block px-4 py-2 text-black hover:bg-gray-100"
//                       onClick={() => setMenuOpen(false)}
//                     >
//                       {route.name}
//                     </Link>
//                   ))}
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



"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/PrivateRoute/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SearchAndFilter from "./SearchAndFilter";
import LoyaltyDiscountBadge from "./LoyaltyDiscountBadge";

const buyerRoutes = [
  { name: "Profile", path: "/profile" },
  { name : "Reservations" , path : "/reservations"}
];

const sellerRoutes = [
  { name: "Post a Service", path: "/addService" }
];

const Header = () => {
  const isLoggedIn = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const menuRef = useRef(null);

  // Update user data when auth state changes
  useEffect(() => {
    setUserEmail(localStorage.getItem("name") || "");
    setUserRole(localStorage.getItem("userRole") || "");
  }, [isLoggedIn]); 

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
     
    router.push("/");
    setMenuOpen(false);
    setUserEmail("");
    setUserRole("");
    window.location.href = "/";
    window.location.reload(); 
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSearch = () => {
    if (!searchValue.trim()) return alert("Please enter a search term");
    router.push(`/search?query=${searchValue}`);
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters
  };

  return (
    <header className="bg-white p-4 shadow-2xl border-b">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center space-x-2" href="/">
          <Image
            src="/images/qReserve_Logo.png"
            alt="Logo"
            width={320}
            height={80}
            className="h-12"
          />
        </Link>

        {/* Search Component */}
        <div className="flex-1 flex items-center justify-center gap-4 max-w-2xl mx-4">
            {userRole === 'BUYER' && (
              <>
                <SearchAndFilter />
                <LoyaltyDiscountBadge />
              </>
            )}
          </div>
          
        <div className="flex items-center space-x-4 w-[300px]">
          {userEmail ? (
            <div ref={menuRef} className="relative z-10">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleMenu}
              >
                <span>{userEmail}</span>
                <div className="flex items-center justify-center bg-gray-200 rounded-full w-8 h-8 text-sm font-medium text-gray-700">
                  {getInitials(userEmail)}
                </div>
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
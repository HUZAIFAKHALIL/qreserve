// app/profile/page.jsx

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProfile() {
  // Initial form state with dummy data (replace with actual user data from your backend or session)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  // Simulating loading user data from an API or session
  useEffect(() => {
    // Fetch user data from your API or use a context to get the current user's details
    setUserData({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "", // Don't pre-fill the password for security reasons
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Handle form submission
    try {
      // Send the updated details to your backend or API to update the user's profile
      // For now, we're just logging the data
      console.log("Updated User Data:", { ...userData, newPassword });

      // Redirect to the profile page after updating
      router.push("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your details.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Password Field (Optional) */}
          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block text-lg font-medium mb-2"
            >
              New Password (Leave blank to keep the current password)
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-lg font-medium mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none"
          >
            Save Changes
          </button>
        </form>
        <p className="mt-4 text-center">
          Want to go back?{" "}
          <Link
            href="/profile"
            className="text-black font-medium hover:text-blue-700"
          >
            View Profile
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");

  const isBrowser = typeof window !== "undefined";
  const loggedInToken = isBrowser ? localStorage.getItem("token") : null;

  // you are already logged in
  if (loggedInToken) {
    return router.push("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Proceed with resetting the password logic
    console.log("New Password:", newPassword);

    const response = await fetch("/api/auth/reset-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      router.push("/login");
    } else {
      setMessage(data.error);
    }

    // Redirect or provide success feedback
    // (e.g., redirect to login or show success message)
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block text-lg font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-lg font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none"
          >
            Reset Password
          </button>
        </form>
        <p className="mt-4 text-center">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:text-blue-700"
          >
            Login here
          </Link>
        </p>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

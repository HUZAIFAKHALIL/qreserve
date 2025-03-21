"use client";
import { useState } from "react";
import Link from "next/link";
import PasswordField from "@/components/PasswordField";
import { useRouter } from "next/navigation";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginWithEmail, setLoginWithEmail] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const isBrowser = typeof window !== "undefined";
  const token = isBrowser ? localStorage.getItem("token") : null;

  if (token) {
    return router.push("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body = {
      identifier,
      password,
    };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.userEmail);
        localStorage.setItem("name", data.userName);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userRole", data.userRole);
        
        // Store discount information in localStorage for use throughout the app
        if (data.discountInfo) {
          localStorage.setItem("discountInfo", JSON.stringify(data.discountInfo));
        }
        
        // Display signup discount notification if available
        if (data.discountInfo?.hasSignupDiscount) {
          const discountAmount = data.discountInfo.signupDiscountAmount;
          const discountType = data.discountInfo.signupDiscountType;
          const discountText = discountType === "PERCENTAGE" 
            ? `${discountAmount}%` 
            : `$${discountAmount}`;
          
          alert(`Welcome! You have a signup discount of ${discountText} available on your first reservation!`);
        }
        
        window.location.href = "/";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!identifier) {
      setError("Email is required");
      return;
    }

    const response = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });

    if (!response.ok) {
      setMessage("Failed to send password reset email. Please try again.");
      return;
    }
    const data = await response.json();
    setError("");
    setMessage(data.message || "Password reset email sent!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        
        {/* Signup Discount Promotion Banner */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800 font-medium">New users get a special discount on their first reservation!</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="identifier"
              className="block text-lg font-medium mb-2"
            >
              {loginWithEmail ? "Email" : "Phone Number"}
            </label>
            <input
              type={loginWithEmail ? "email" : "tel"}
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                loginWithEmail ? "Enter your email" : "Enter your phone number"
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
              autoFocus
            />
          </div>
          {error && <p>{error}</p>}

          <PasswordField password={password} setPassword={setPassword} />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm">
            <button
              className="underline text-black hover:text-blue-700 cursor-pointer bg-white"
              onClick={handleForgotPassword}
            >
              Forgot Password
            </button>
          </p>

          <p className="mt-4 text-center">
            Don{"'"}t have an account?{" "}
            <Link
              href="/signup"
              className="text-black font-medium hover:text-blue-700"
            >
              Sign Up
            </Link>
          </p>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setLoginWithEmail(!loginWithEmail)}
              className="text-blue-700 hover:underline"
            >
              {loginWithEmail ? "Login with Phone Number" : "Login with Email"}
            </button>
            {message && <p className="mt-2 text-green-600">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
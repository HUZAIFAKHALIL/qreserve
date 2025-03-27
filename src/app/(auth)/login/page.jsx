"use client";
import { useState } from "react";
import Link from "next/link";
import PasswordField from "@/components/PasswordField";
import { useRouter } from "next/navigation";
import { Apple, Facebook } from "lucide-react";
import Image from "next/image";

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
    <div className="flex min-h-screen">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-[45%] p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-600">Please enter your details to sign in</p>
          </div>

          <div className="flex gap-3 mb-8">
            <button className="flex-1 py-3 px-4 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Apple className="w-5 h-5" />
            </button>
            <button className="flex-1 py-3 px-4 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Image src="https://img.icons8.com/color/48/000000/google-logo.png" width={20} height={20} alt="Google" />
            </button>
            <button className="flex-1 py-3 px-4 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-gray-200"></div>
            <span className="text-gray-500">or</span>
            <div className="h-[1px] flex-1 bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium mb-2 text-gray-700">
                {loginWithEmail ? "Email" : "Phone Number"}
              </label>
              <input
                type={loginWithEmail ? "email" : "tel"}
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={loginWithEmail ? "Enter your email" : "Enter your phone number"}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <PasswordField password={password} setPassword={setPassword} />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setLoginWithEmail(!loginWithEmail)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {loginWithEmail ? "Use phone number" : "Use email"}
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot password?
              </button>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {message && <p className="text-green-600 text-sm text-center">{message}</p>}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#2B4C3F] text-white rounded-xl hover:bg-[#1e3b2f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B4C3F] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-[#2B4C3F] hover:text-[#1e3b2f]">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div className="absolute inset-0 bg-[#2B4C3F]/10"></div>
        <div className="h-full w-full object-cover" style={{
          backgroundImage: `url('https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
      </div>
    </div>
  );
}
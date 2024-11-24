"use client";
import { useState } from "react";
import PasswordField from "@/components/PasswordField";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form data to be sent to the API
    const userData = {
      name,
      email,
      phone,
      dob,
      gender,
      password,
    };

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        // Redirect or show success message
        alert("User signed up successfully!");
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Something went wrong.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full p-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"; // Increased padding and font size

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        {" "}
        {/* Increased max-width and padding */}
        <h2 className="text-3xl font-semibold text-center mb-6">
          Sign Up
        </h2>{" "}
        {/* Increased heading size */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-base font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={inputClassName}
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-base font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={inputClassName}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-base font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className={inputClassName}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dob" className="block text-base font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-base font-medium mb-1"
            >
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`${inputClassName} appearance-none bg-white text-black pr-8`}
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-black">
                ▼
              </span>
            </div>
          </div>
          <PasswordField
            password={password}
            setPassword={setPassword}
            className={inputClassName}
          />
          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}{" "}
          {/* Increased margin */}
          <p className="mt-4 text-center text-base">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black font-medium hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

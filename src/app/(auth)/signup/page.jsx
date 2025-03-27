"use client";
import { useState } from "react";
import PasswordField from "@/components/PasswordField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Apple, Facebook } from "lucide-react";
import Image from "next/image";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [userRole, setUserRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = {
      name,
      email,
      phone,
      dob,
      gender,
      password,
      userRole
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
        const responseData = await res.json();
        
        if (userRole === "BUYER") {
          alert(`User signed up successfully! You've received a 10% signup discount.`);
        } else {
          alert("User signed up successfully!");
        }
        
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

  const inputClassName = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2B4C3F] bg-white text-gray-900";

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Image */}
      <div className="hidden lg:block lg:w-[45%] relative">
        <div className="absolute inset-0 bg-[#2B4C3F]/10"></div>
        <div className="h-full w-full object-cover" style={{
          backgroundImage: `url('https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-[55%] p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-gray-600">Join us today and start your journey</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
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
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
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

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-700">
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

              <div>
                <label htmlFor="dob" className="block text-sm font-medium mb-2 text-gray-700">
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

              <div>
                <label htmlFor="gender" className="block text-sm font-medium mb-2 text-gray-700">
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`${inputClassName} appearance-none pr-10`}
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    ▼
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="userRole" className="block text-sm font-medium mb-2 text-gray-700">
                  User Role
                </label>
                <div className="relative">
                  <select
                    id="userRole"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className={`${inputClassName} appearance-none pr-10`}
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller</option>
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    ▼
                  </span>
                </div>
              </div>
            </div>

            <div>
              <PasswordField password={password} setPassword={setPassword} />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#2B4C3F] text-white rounded-xl hover:bg-[#1e3b2f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B4C3F] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#2B4C3F] hover:text-[#1e3b2f]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
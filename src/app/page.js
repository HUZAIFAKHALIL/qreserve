"use client";
import { useState } from "react";
import Header from "@/components/Header";
import MainPage from "@/components/Main";
import Footer from "@/components/Footer";

export default function Home() {
  const [user, setUser] = useState(null);
  return (
    
    <div>
      <MainPage />
      {/* <Footer /> */}
    </div>
  );
}

import Footer from "@/components/Footer";
import "./globals.css";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Nunito } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";

const nunito = Nunito({ subsets: ["latin"] });
export const metadata = {
  title: "qReserve",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
      <ToastContainer />
        <Header />
        <main className={`flex-grow ${nunito.className}`}>{children}</main>
        <ChatWidget />
        <Footer />
      
      </body>
    </html>
  );
}

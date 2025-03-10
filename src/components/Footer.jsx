// components/Footer.jsx

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black p-6 lg:p-8 text-white">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
        {/* Left Side: Horizontal Links with Vertical Lists */}
        <div className="flex space-x-10">
          {/* Resources Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide">
              COMPANY INFO
            </h2>
            <ul className="mt-4 space-y-2 font-normal">
              <li>
                <Link href="/companyinfo/about" className="hover:underline">
                  About qReserve
                </Link>
              </li>

              <li>
                <Link
                  href="/companyinfo/fashionblogger"
                  className="hover:underline"
                >
                  Fashion Blogger
                </Link>
              </li>
              <li>
                <Link
                  href="/companyinfo/socialresponsibility"
                  className="hover:underline"
                >
                  Social Responsibility
                </Link>
              </li>
              <li>
                <Link href="/companyinfo/careers" className="hover:underline">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide">
              HELP & SUPPORT
            </h2>
            <ul className="mt-4 space-y-2 font-normal">
              <li>
                <Link href="/help/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/help/termsconditions" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
              <Link href="/help"className="hover:underline">
                    FAQ
            </Link>
            </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Social Media and Payment Methods */}
        <div className="flex flex-col items-start md:items-start space-y-6">
          {/* Social Media Links */}
          <div>
            <h2 className="text-sm font-semibold uppercase">Find Us</h2>
            <div className="flex space-x-4 mt-4">
              <Link href="https://www.facebook.com">
                <Image
                  src="https://img.icons8.com/ios-glyphs/30/ffffff/facebook.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="https://www.instagram.com">
                <Image
                  src="https://img.icons8.com/ios-glyphs/30/ffffff/instagram-new.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="https://www.twitter.com">
                <Image
                  src="https://img.icons8.com/ios-glyphs/30/ffffff/twitter.png"
                  alt="Twitter"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h2 className="text-sm font-semibold uppercase">
              Accepted Payments
            </h2>
            <div className="flex space-x-4 mt-4">
              <Image
                src="https://img.icons8.com/ios-glyphs/30/ffffff/visa.png"
                alt="Visa"
                width={24}
                height={24}
              />
              <Image
                src="https://img.icons8.com/ios-glyphs/30/ffffff/mastercard.png"
                alt="Mastercard"
                width={24}
                height={24}
              />
              <Image
                src="https://img.icons8.com/ios-glyphs/30/ffffff/paypal.png"
                alt="PayPal"
                width={24}
                height={24}
              />
              <Image
                src="https://img.icons8.com/ios-glyphs/30/ffffff/apple-pay.png"
                alt="Apple Pay"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />
      <div className="text-center text-sm text-gray-400">
        © 2024{" "}
        <Link href="#" className="hover:underline">
          qReverse™
        </Link>
        . All Rights Reserved.
      </div>
    </footer>
  );
}

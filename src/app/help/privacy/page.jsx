import React from 'react';
import { Shield, Users, Database, Lock, Eye, Bell, Scale, Mail, HelpCircle } from 'lucide-react';

function PrivacyAndPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
              Privacy Policy
            </h1>
            <p className="mt-3 text-xl text-blue-100 max-w-2xl mx-auto">
              Your privacy matters to us. Learn how we protect and manage your data on our booking platform.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              This Privacy Policy outlines how we collect, use, and protect your personal information when you use our booking platform. It applies to all users including buyers, sellers, and administrators.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Information We Collect</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  For Buyers
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Contact information (name, email, phone number)</li>
                  <li>Booking history and preferences</li>
                  <li>Payment information</li>
                  <li>Reviews and feedback</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  For Sellers
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Business information and credentials</li>
                  <li>Service listings and availability</li>
                  <li>Transaction history</li>
                  <li>Performance metrics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. How We Use Your Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Lock className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Security</h3>
                <p className="text-gray-600">Protecting your account and transactions through advanced encryption.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Eye className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Personalization</h3>
                <p className="text-gray-600">Customizing your experience based on preferences and history.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Bell className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Communications</h3>
                <p className="text-gray-600">Sending important updates and notifications about your bookings.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Scale className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Legal Compliance</h3>
                <p className="text-gray-600">Meeting regulatory requirements and preventing fraud.</p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Your Rights</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">•</div>
                  <p>Access and receive a copy of your personal data</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">•</div>
                  <p>Request correction or deletion of your personal data</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">•</div>
                  <p>Object to the processing of your personal data</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">•</div>
                  <p>Withdraw consent at any time where processing is based on consent</p>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Contact Us</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-600">privacy@example.com</span>
                </div>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                  Get Support
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            Last updated: March 2024. This privacy policy is subject to change.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyAndPolicy;
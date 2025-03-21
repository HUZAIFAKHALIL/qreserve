export default function TermsAndConditions() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Terms and <span className="text-blue-600">Conditions</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Last updated: January 2024
        </p>
      </div>

      {/* Introduction */}
      <div className="prose prose-lg max-w-none mb-16">
        <div className="bg-blue-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to qReserve</h2>
          <p className="text-gray-700">
            These terms and conditions outline the rules and regulations for the use of qReserve's platform. 
            By accessing this platform, we assume you accept these terms and conditions in full. 
            Do not continue to use qReserve if you do not accept all of the terms and conditions stated on this page.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {/* User Agreements */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">1. User Agreements</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• Users must be at least 18 years old to create an account</li>
              <li>• Users are responsible for maintaining the confidentiality of their account</li>
              <li>• All provided information must be accurate and complete</li>
              <li>• Users agree not to use the platform for any illegal purposes</li>
              <li>• Multiple accounts for the same user are not permitted</li>
            </ul>
          </div>

          {/* Service Provider Terms */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">2. Service Provider Terms</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• Providers must maintain accurate service descriptions and pricing</li>
              <li>• Providers are responsible for the quality of their services</li>
              <li>• Commission fees apply to all successful bookings</li>
              <li>• Providers must respond to booking requests within 24 hours</li>
              <li>• Cancellation policies must be clearly stated</li>
            </ul>
          </div>

          {/* Buyer Terms */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">3. Buyer Terms</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• Buyers must honor confirmed bookings</li>
              <li>• Payment is required at the time of booking</li>
              <li>• Cancellation policies vary by service provider</li>
              <li>• Buyers agree to provide accurate booking information</li>
              <li>• Reviews must be based on actual experiences</li>
            </ul>
          </div>

          {/* Platform Rules */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">4. Platform Rules</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• No spam, fraudulent activities, or misuse of the platform</li>
              <li>• All communications should remain on the platform</li>
              <li>• Harassment or abuse will not be tolerated</li>
              <li>• Platform fees are non-negotiable</li>
              <li>• qReserve reserves the right to suspend or terminate accounts</li>
            </ul>
          </div>

          {/* Privacy & Data */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">5. Privacy & Data</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• User data is collected and processed according to our Privacy Policy</li>
              <li>• Users retain ownership of their content</li>
              <li>• Platform usage data may be analyzed for improvements</li>
              <li>• Data security measures are implemented and maintained</li>
              <li>• Third-party integrations are subject to their own privacy policies</li>
            </ul>
          </div>

          {/* Liability & Disputes */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">6. Liability & Disputes</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• qReserve acts as a platform facilitator only</li>
              <li>• Disputes between users should be resolved amicably</li>
              <li>• Platform mediation is available for unresolved disputes</li>
              <li>• Service quality is the provider's responsibility</li>
              <li>• Force majeure conditions are recognized</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>Email: legal@qreserve.com</p>
            <p>Phone: 1-800-QRESERVE</p>
            <p>Address: 123 Business Street, Tech City, TC 12345</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-16">
        <p className="text-gray-500">
          These terms and conditions are subject to change without notice. 
          Please check this page regularly for updates.
        </p>
      </div>
    </div>
  );
}
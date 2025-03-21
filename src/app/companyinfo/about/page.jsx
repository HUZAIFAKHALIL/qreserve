export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Connecting Services with{" "}
          <span className="text-indigo-600">People Who Need Them</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          qReserve is revolutionizing how services are discovered, booked, and managed.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-indigo-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700">
          We're on a mission to create a seamless connection between service providers
          and customers, while ensuring quality, reliability, and trust in every
          transaction. Our platform empowers businesses to grow and helps customers
          find exactly what they need, when they need it.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* For Sellers */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-indigo-600 mb-4">For Sellers</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Showcase your services to a wider audience</li>
            <li>• Manage bookings effortlessly</li>
            <li>• Real-time scheduling and availability updates</li>
            <li>• Secure payment processing</li>
            <li>• Build your business reputation</li>
          </ul>
        </div>

        {/* For Buyers */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-indigo-600 mb-4">For Buyers</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Easy service discovery and comparison</li>
            <li>• Secure and convenient booking</li>
            <li>• Real-time availability checking</li>
            <li>• Verified service providers</li>
            <li>• Review and rating system</li>
          </ul>
        </div>

        {/* Platform Benefits */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-indigo-600 mb-4">Platform Benefits</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• 24/7 Admin support and monitoring</li>
            <li>• Secure transaction handling</li>
            <li>• Quality assurance measures</li>
            <li>• Dispute resolution system</li>
            <li>• Continuous platform improvements</li>
          </ul>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose qReserve?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">
              Trusted Platform
            </h3>
            <p className="text-gray-700">
              Our dedicated admin team ensures the highest standards of service quality
              and user satisfaction. We carefully verify all service providers and
              maintain platform integrity.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">
              Seamless Experience
            </h3>
            <p className="text-gray-700">
              From browsing services to completing bookings, we've designed every
              step to be intuitive and efficient. Our platform handles the
              complexities so you can focus on what matters.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of satisfied users who have transformed how they handle
          service bookings.
        </p>
        <div className="space-x-4">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Register as Seller
          </button>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
            Start Booking
          </button>
        </div>
      </div>
    </div>
  );
}
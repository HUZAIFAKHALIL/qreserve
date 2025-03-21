export default function SocialResponsibility() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Making a <span className="text-green-600">Positive Impact</span> Together
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          At qReserve, we believe in using our platform to create positive change in our communities and environment
        </p>
      </div>

      {/* Our Commitment Section */}
      <div className="bg-green-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
        <p className="text-lg text-gray-700">
          We're dedicated to building a sustainable future through responsible business practices,
          community engagement, and environmental stewardship. Our platform not only connects
          people but also serves as a catalyst for positive social change.
        </p>
      </div>

      {/* Initiatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Environmental Impact */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Environmental Impact</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Carbon-neutral operations</li>
            <li>• Paperless booking system</li>
            <li>• Green hosting solutions</li>
            <li>• Sustainable office practices</li>
            <li>• Environmental awareness campaigns</li>
          </ul>
        </div>

        {/* Community Support */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Community Support</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Local business partnerships</li>
            <li>• Youth entrepreneurship programs</li>
            <li>• Skills development workshops</li>
            <li>• Community event sponsorships</li>
            <li>• Charitable giving initiatives</li>
          </ul>
        </div>

        {/* Social Impact */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Social Impact</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Inclusive platform design</li>
            <li>• Fair pricing policies</li>
            <li>• Equal opportunity employment</li>
            <li>• Diversity and inclusion programs</li>
            <li>• Ethical business practices</li>
          </ul>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Impact in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-green-600 text-4xl font-bold mb-2">50K+</div>
            <p className="text-gray-600">Trees Planted</p>
          </div>
          <div className="text-center">
            <div className="text-green-600 text-4xl font-bold mb-2">100+</div>
            <p className="text-gray-600">Community Partners</p>
          </div>
          <div className="text-center">
            <div className="text-green-600 text-4xl font-bold mb-2">$1M+</div>
            <p className="text-gray-600">Donated to Causes</p>
          </div>
          <div className="text-center">
            <div className="text-green-600 text-4xl font-bold mb-2">5000+</div>
            <p className="text-gray-600">Volunteer Hours</p>
          </div>
        </div>
      </div>

      {/* Current Initiatives */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Current Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-green-600 mb-3">
              Green Technology Program
            </h3>
            <p className="text-gray-700">
              We're investing in sustainable technology solutions and helping our service
              providers transition to eco-friendly practices through education and resources.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-600 mb-3">
              Community Empowerment
            </h3>
            <p className="text-gray-700">
              Through partnerships with local organizations, we're providing training and
              opportunities for underserved communities to participate in the digital economy.
            </p>
          </div>
        </div>
      </div>

      {/* Get Involved Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Join Us in Making a Difference
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Together, we can create positive change while building successful businesses and
          strong communities.
        </p>
        <div className="space-x-4">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Partner With Us
          </button>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Careers() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Build the Future of <span className="text-purple-600">Service Booking</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Join our dynamic team and help transform how people discover and book services
        </p>
      </div>

      {/* Why Join Us Section */}
      <div className="bg-purple-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join qReserve?</h2>
        <p className="text-lg text-gray-700">
          At qReserve, we're more than just a booking platform. We're a team of passionate
          individuals working together to revolutionize the service industry. Our culture
          promotes innovation, collaboration, and personal growth.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Work Benefits */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">Work Benefits</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Competitive salary packages</li>
            <li>• Performance bonuses</li>
            <li>• Stock options</li>
            <li>• Flexible working hours</li>
            <li>• Remote work options</li>
          </ul>
        </div>

        {/* Health & Wellness */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">Health & Wellness</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Comprehensive health insurance</li>
            <li>• Mental health support</li>
            <li>• Wellness programs</li>
            <li>• Gym membership</li>
            <li>• Annual health checkups</li>
          </ul>
        </div>

        {/* Growth & Development */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">Growth</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Learning & development budget</li>
            <li>• Career progression paths</li>
            <li>• Mentorship programs</li>
            <li>• Conference attendance</li>
            <li>• Leadership training</li>
          </ul>
        </div>
      </div>

      {/* Culture Section */}
      <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Culture</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-purple-600 text-4xl font-bold mb-2">Innovation</div>
            <p className="text-gray-600">We encourage new ideas</p>
          </div>
          <div className="text-center">
            <div className="text-purple-600 text-4xl font-bold mb-2">Growth</div>
            <p className="text-gray-600">Continuous learning</p>
          </div>
          <div className="text-center">
            <div className="text-purple-600 text-4xl font-bold mb-2">Balance</div>
            <p className="text-gray-600">Work-life harmony</p>
          </div>
          <div className="text-center">
            <div className="text-purple-600 text-4xl font-bold mb-2">Impact</div>
            <p className="text-gray-600">Make a difference</p>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Open Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-purple-600 mb-3">
              Engineering
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Senior Full Stack Developer</li>
              <li>• DevOps Engineer</li>
              <li>• Mobile App Developer</li>
              <li>• UI/UX Designer</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-purple-600 mb-3">
              Business
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Product Manager</li>
              <li>• Marketing Specialist</li>
              <li>• Customer Success Manager</li>
              <li>• Business Development</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Application Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Join Our Team?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Take the first step towards an exciting career at qReserve
        </p>
        <div className="space-x-4">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            View All Positions
          </button>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors">
            Meet the Team
          </button>
        </div>
      </div>
    </div>
  );
}
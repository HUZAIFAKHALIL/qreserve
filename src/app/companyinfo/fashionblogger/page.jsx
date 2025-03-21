export default function FashionBlogger() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Share Your Style With <span className="text-rose-600">The World</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Join our community of fashion influencers and share your unique perspective on style
        </p>
      </div>

      {/* Why Join Section */}
      <div className="bg-rose-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join qReserve Fashion?</h2>
        <p className="text-lg text-gray-700">
          As a fashion blogger on qReserve, you'll have the opportunity to showcase your style,
          build your following, and connect with brands and fashion enthusiasts. Our platform
          provides the tools and exposure you need to turn your passion for fashion into a
          thriving business.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Content Creation */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-rose-600 mb-4">Content Creation</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Professional blogging tools</li>
            <li>• Image galleries and portfolios</li>
            <li>• Style guides and lookbooks</li>
            <li>• Video content integration</li>
            <li>• Social media integration</li>
          </ul>
        </div>

        {/* Monetization */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-rose-600 mb-4">Monetization</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Brand collaboration opportunities</li>
            <li>• Affiliate marketing tools</li>
            <li>• Sponsored content features</li>
            <li>• Direct product linking</li>
            <li>• Analytics and performance tracking</li>
          </ul>
        </div>

        {/* Community Features */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-rose-600 mb-4">Community</h3>
          <ul className="space-y-3 text-gray-600">
            <li>• Connect with other bloggers</li>
            <li>• Engage with followers</li>
            <li>• Join fashion challenges</li>
            <li>• Participate in events</li>
            <li>• Share styling tips</li>
          </ul>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-rose-600 mb-3">
              Growing Your Influence
            </h3>
            <p className="text-gray-700">
              Our top fashion bloggers have built significant followings and secured major brand
              partnerships through our platform. With our tools and support, you can focus on
              creating great content while we handle the technical details.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-rose-600 mb-3">
              Brand Collaborations
            </h3>
            <p className="text-gray-700">
              We connect fashion bloggers with leading brands for sponsored content,
              product reviews, and long-term partnerships. Our platform makes it easy to
              manage collaborations and grow your business.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Platform Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-rose-600 text-4xl font-bold mb-2">100K+</div>
            <p className="text-gray-600">Active Fashion Enthusiasts</p>
          </div>
          <div className="text-center">
            <div className="text-rose-600 text-4xl font-bold mb-2">500+</div>
            <p className="text-gray-600">Brand Partners</p>
          </div>
          <div className="text-center">
            <div className="text-rose-600 text-4xl font-bold mb-2">24/7</div>
            <p className="text-gray-600">Creator Support</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Your Fashion Journey?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join our community of fashion creators and start sharing your unique style with the world.
        </p>
        <div className="space-x-4">
          <button className="bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors">
            Start Blogging
          </button>
          <button className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold border-2 border-rose-600 hover:bg-rose-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
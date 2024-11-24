import Image from "next/image"; // Use Next.js Image for optimized loading
import Link from "next/link"; // Import Link from Next.js
import { useAuth } from "@/PrivateRoute/auth";

const MainPage = () => {
  const prefixURL = "/service"; // Prefix for all service links
  const isLoggedIn = useAuth();

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Our Services
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Service Cards */}
          <ServiceCard
            title="Book a Hotel"
            imageSrc="/images/hotel.jpg"
            description="Find the perfect hotel for your stay."
            link={`${prefixURL}?serviceType=book-hotel`}
          />
          <ServiceCard
            title="Rent a Car"
            imageSrc="/images/car.jpg"
            description="Rent a car for your travels."
            link={`${prefixURL}?serviceType=rent-car`}
          />
          <ServiceCard
            title="Salon Appointment"
            imageSrc="/images/salon.jpg"
            description="Book a relaxing salon appointment."
            link={`${prefixURL}?serviceType=book-salon`}
          />
          <ServiceCard
            title="Gym"
            imageSrc="/images/gym.jpg"
            description="Reserve a Gym facility near you."
            link={`${prefixURL}?serviceType=book-gym`}
          />
          <ServiceCard
            title="Event Halls"
            imageSrc="/images/hall.jpg"
            description="Find the perfect hall for your event."
            link={`${prefixURL}?serviceType=book-hall`}
          />
          <ServiceCard
            title="Activities"
            imageSrc="/images/activity.jpg"
            description="Explore exciting activities to do."
            link={`${prefixURL}?serviceType=book-activity`}
          />
          <ServiceCard
            title="Flights"
            imageSrc="/images/flight.jpg"
            description="Book a flight for your next adventure."
            link={`${prefixURL}?serviceType=book-flight`}
          />
          <ServiceCard
            title="Playgrounds"
            imageSrc="/images/playground.jpg"
            description="Book a playground for your kids."
            link={`${prefixURL}?serviceType=book-playground`}
          />
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, imageSrc, description, link }) => {
  return (
    <Link
      className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center"
      href={link}
    >
      {/* Image */}
      <div className="relative w-full h-56 mb-4">
        <Image
          src={imageSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Service Info */}
      <div className="p-4 text-center space-y-2">
        {/* Service Title */}
        <h3 className="text-xl font-semibold text-black">{title}</h3>

        {/* Service Description */}
        <p className="text-gray-600">{description}</p>

        {/* CTA Button */}
        {/* <Link href={link}>
          <button className="mt-4 py-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all">
            Reserve Now
          </button>
        </Link> */}
      </div>
    </Link>
  );
};

export default MainPage;

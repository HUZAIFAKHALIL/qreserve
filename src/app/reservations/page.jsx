'use client';

import { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import PendingReservations from '../pending-reservations/page';
import ConfirmedReservations from '../confirmed-reservations/page';

const buyerRoutes = [
  { name: "Pending Reservations", path: "/pending-reservations" },
  { name: "Confirmed Reservations", path: "/confirmed-reservations" },
];

const Reservations = () => {
  const [activeTab, setActiveTab] = useState(buyerRoutes[0].name);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reservations</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {buyerRoutes.map((route) => (
          <button
            key={route.name}
            onClick={() => setActiveTab(route.name)}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === route.name
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {route.name === "Pending Reservations" ? (
              <Clock className="w-4 h-4 mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {route.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "Pending Reservations" ? (
          <PendingReservations />
        ) : (
          <ConfirmedReservations />
        )}
      </div>
    </div>
  );
};

export default Reservations;
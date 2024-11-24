"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SearchAndFilter = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    // dateRange: { start: "", end: "" },
    priceRange: [0, 1000],
    // serviceType: "",
    rating: "",
  });

  const [category, setCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term.");
      return;
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      query: searchQuery,
      location: filters.location || "",
      //   startDate: filters.dateRange.start || "",
      //   endDate: filters.dateRange.end || "",
      minPrice: filters.priceRange[0].toString(),
      maxPrice: filters.priceRange[1].toString(),
      //   serviceType: filters.serviceType || "",
      rating: filters.rating || "",
      category,
    });

    setShowFilters(false);

    // Redirect to the search results page
    router.push(`/search?${queryParams.toString()}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full md:w-1/2" ref={filterRef}>
      {/* Search Bar */}
      <div className="mb flex items-center">
        <input
          type="text"
          placeholder="Search for services or items..."
          className="w-full p-2 border rounded-lg shadow-sm h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowFilters(true)}
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div
          className="absolute top-16 left-0 w-full bg-white shadow-lg p-6 rounded-lg z-10"
          tabIndex={-1}
        >
          {/* Category Selection */}
          <div className="mb-4 flex space-x-4">
            {["all", "travel", "events", "services"].map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg ${
                  category === cat ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                className="w-full p-2 border rounded-lg"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            {/* Date Range Filter */}
            {/* <div className="md:col-span-2">
              <label className="block mb-1">Date Range</label>
              <div className="flex space-x-4">
                <input
                  type="date"
                  name="startDate"
                  className="flex-grow p-2 border rounded-lg"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value },
                    }))
                  }
                />
                <input
                  type="date"
                  name="endDate"
                  className="flex-grow p-2 border rounded-lg"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value },
                    }))
                  }
                />
              </div>
            </div> */}

            {/* Price Range Filter */}
            <div>
              <label className="block mb-1">Price Range</label>
              <div className="flex space-x-2 items-center">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  className="w-1/2 p-2 border rounded-lg"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [+e.target.value, prev.priceRange[1]],
                    }))
                  }
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  className="w-1/2 p-2 border rounded-lg"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], +e.target.value],
                    }))
                  }
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block mb-1">Rating</label>
              <select
                name="rating"
                className="w-full p-2 border rounded-lg"
                value={filters.rating}
                onChange={handleFilterChange}
              >
                <option value="">Select rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6">
            <button
              className="px-6 py-3 bg-black text-white rounded-lg w-full"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;

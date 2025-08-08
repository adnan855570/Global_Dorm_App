
import React, { useState } from "react";

/**
 * RoomsFilter
 * A small form for users to filter room listings by location, price, language, or postcode.
 *
 * Props:
 *   onFilter: function called with the filter object when the user submits the form
 */
export default function RoomsFilter({ onFilter }) {
  // State for each filter input
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState("");
  const [postcode, setPostcode] = useState("");

  // Handles the form submission
  function handleSubmit(e) {
    e.preventDefault();
    // Pass all filter values up to parent (can be empty)
    onFilter({ location, price, language, postcode });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 mb-6 bg-white dark:bg-gray-900 rounded-xl shadow p-4"
    >
      {/* Location Input */}
      <input
        type="text"
        placeholder="Location"
        className="flex-1 min-w-[120px] px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      {/* Price Input */}
      <input
        type="number"
        placeholder="Max Price"
        className="flex-1 min-w-[100px] px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none"
        value={price}
        onChange={e => setPrice(e.target.value)}
        min={0}
      />
      {/* Language Input */}
      <input
        type="text"
        placeholder="Language"
        className="flex-1 min-w-[100px] px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none"
        value={language}
        onChange={e => setLanguage(e.target.value)}
      />
      {/* Postcode Input */}
      <input
        type="text"
        placeholder="Postcode"
        className="flex-1 min-w-[100px] px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none"
        value={postcode}
        onChange={e => setPostcode(e.target.value)}
      />
      {/* Search Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}


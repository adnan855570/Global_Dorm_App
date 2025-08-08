// GeocodeSearch.jsx
import React, { useState } from "react";

/**
 * GeocodeSearch
 * A little input form for searching rooms by postcode.
 * Props:
 *  - onSearch: Function(postcode) — called when user submits a postcode.
 *
 * Example usage:
 *   <GeocodeSearch onSearch={handlePostcodeSearch} />
 */
export default function GeocodeSearch({ onSearch }) {
  const [postcode, setPostcode] = useState("");

  // When form is submitted, call the onSearch prop with the postcode
  function handleSubmit(e) {
    e.preventDefault();
    if (postcode.trim()) {
      onSearch(postcode.trim());
    }
  }

  return (
    <form
      className="flex items-center gap-3 mb-4"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {/* Postcode input box */}
      <input
        type="text"
        value={postcode}
        onChange={e => setPostcode(e.target.value)}
        placeholder="Search by postcode"
        className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-400 transition"
        aria-label="Postcode"
      />
      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}


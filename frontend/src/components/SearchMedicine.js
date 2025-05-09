import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchMedicine = ({ medicines, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter medicines based on search query
    const filteredMedicines = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(value.toLowerCase())
    );

    // Send filtered results to parent component
    onSearch(filteredMedicines);
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search medicine..."
        value={query}
        onChange={handleSearch}
        className="w-full p-3 pl-10 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
    </div>
  );
};

export default SearchMedicine;

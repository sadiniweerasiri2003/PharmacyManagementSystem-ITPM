import React, { useState, useEffect } from "react";

const UpdateMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [medicine, setMedicine] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/medicines");
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setMedicines(data);
        } else {
          setMessage("No medicines found.");
        }
      } else {
        setMessage("Failed to fetch medicines.");
      }
    } catch (error) {
      setMessage("Error fetching data.");
    }
  };

  const handleSelectChange = (e) => {
    const selectedMedicine = medicines.find((med) => med._id === e.target.value);
    setSelectedId(e.target.value);
    setMedicine({
      ...selectedMedicine,
      expiryDate: selectedMedicine.expiryDate ? selectedMedicine.expiryDate.split("T")[0] : "",
      lastRestockedDate: selectedMedicine.lastRestockedDate ? selectedMedicine.lastRestockedDate.split("T")[0] : "",
    });
  };

  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!medicine) {
      setMessage("Please select a medicine to update.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/medicines/${medicine._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicine),
      });

      if (response.ok) {
        setMessage("✅ Medicine updated successfully!");
      } else {
        setMessage("❌ Failed to update medicine.");
      }
    } catch (error) {
      setMessage("❌ Error updating medicine.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Update Medicine</h2>

        {message && <p className="text-center text-lg font-medium text-red-500 mb-4">{message}</p>}

        {/* Dropdown to select medicine */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Select Medicine:</label>
          <select
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedId}
            onChange={handleSelectChange}
          >
            <option value="">-- Select a Medicine --</option>
            {medicines.map((med) => (
              <option key={med._id} value={med._id}>
                {med.name} (Batch: {med.batchNumber})
              </option>
            ))}
          </select>
        </div>

        {medicine ? (
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={medicine.name || ""}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Batch Number:</label>
              <input
                type="text"
                name="batchNumber"
                value={medicine.batchNumber || ""}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Expiry Date:</label>
              <input
                type="date"
                name="expiryDate"
                value={medicine.expiryDate || ""}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Price:</label>
              <input
                type="number"
                name="price"
                value={medicine.price || ""}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={medicine.quantity || ""}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Last Restocked Date:</label>
              <input
                type="date"
                name="lastRestockedDate"
                value={medicine.lastRestockedDate || ""}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Supplier ID:</label>
              <input
                type="text"
                name="supplierId"
                value={medicine.supplierId || ""}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2 text-center">
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
              >
                Update Medicine
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-600">Please select a medicine to update.</p>
        )}
      </div>
    </div>
  );
};

export default UpdateMedicine;

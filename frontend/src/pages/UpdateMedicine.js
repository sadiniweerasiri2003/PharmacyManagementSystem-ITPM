import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [message, setMessage] = useState("");
  const [suppliers, setSuppliers] = useState([]); // Add suppliers state

  useEffect(() => {
    fetchMedicine();
    fetchSuppliers(); // Add this function call
  }, []);

  const fetchMedicine = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/medicines/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMedicine({
          ...data,
          expiryDate: data.expiryDate ? data.expiryDate.split("T")[0] : "",
          lastRestockedDate: data.lastRestockedDate ? data.lastRestockedDate.split("T")[0] : "",
        });
      } else {
        setMessage("Failed to fetch medicine.");
      }
    } catch (error) {
      setMessage("Error fetching data.");
    }
  };

  // Add this function to fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/suppliers");
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        setMessage("Failed to fetch suppliers.");
      }
    } catch (error) {
      setMessage("Error fetching suppliers.");
    }
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
        // Add navigation after successful update
        setTimeout(() => {
          navigate('/inventory-dashboard'); // Update this to match your dashboard route
        }, 1500);
      } else {
        setMessage("❌ Failed to update medicine.");
      }
    } catch (error) {
      setMessage("❌ Error updating medicine.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Update Medicine</h2>

        {message && <p className="text-center text-lg font-medium text-red-500 mb-4">{message}</p>}

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

            {/* Replace the supplier ID input with dropdown */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Supplier</label>
              <select
                name="supplierId"
                value={medicine.supplierId || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.name} ({supplier.supplierId})
                  </option>
                ))}
              </select>
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
          <p className="text-center text-gray-600">Loading medicine data...</p>
        )}
      </div>
    </div>
  );
};

export default UpdateMedicine;

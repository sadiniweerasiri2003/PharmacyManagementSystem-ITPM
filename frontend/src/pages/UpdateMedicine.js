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
    <div className="p-8 bg-[#f5fff2] min-h-screen">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-[#1B5E20] mb-8 text-center">Update Medicine</h2>

        {message && (
          <div className={`p-4 mb-6 rounded-lg text-center text-lg font-medium ${
            message.includes("✅") 
              ? 'bg-green-50 text-[#1B5E20] border-2 border-[#1B5E20]/20' 
              : 'bg-red-50 text-red-700 border-2 border-red-200'
          }`}>
            {message}
          </div>
        )}

        {medicine ? (
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Medicine Name</label>
              <input
                type="text"
                name="name"
                value={medicine.name || ""}
                className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={medicine.batchNumber || ""}
                className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                onChange={handleChange}
                required
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={medicine.expiryDate || ""}
                className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Unit Price (LKR)</label>
              <input
                type="number"
                name="price"
                value={medicine.price || ""}
                className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Stock Quantity</label>
              <input
                type="number"
                name="quantity"
                value={medicine.quantity || ""}
                className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Last Restocked Date</label>
              <input
                type="date"
                name="lastRestockedDate"
                value={medicine.lastRestockedDate || ""}
                className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Select Supplier</label>
              <select
                name="supplierId"
                value={medicine.supplierId || ""}
                onChange={handleChange}
                className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
                required
              >
                <option value="">Choose a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.name} ({supplier.supplierId})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 pt-6">
              <button
                type="submit"
                className="w-full bg-[#1B5E20] text-white py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-[#1B5E20]/90 transform hover:scale-[1.02] transition-all duration-200"
              >
                Update Medicine Details
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1B5E20] border-t-transparent mx-auto"></div>
            <p className="text-[#1B5E20] mt-4 text-lg">Loading medicine data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateMedicine;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupplierOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    supplierId: "",
    expectedDeliveryDate: "",
    medicines: "",
    orderStatus: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Self-contained fetch function
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/supplierorders");
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error("Fetch Error:", err.response ? err.response.data : err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedMedicines = form.medicines
      ? form.medicines.split(",").map((med) => ({
          medicineId: med.trim(),
          orderedQuantity: 1,
          receivedQuantity: 0,
          totalAmount: 100,
        }))
      : [];

    const requestData = {
      supplierId: form.supplierId,
      expectedDeliveryDate: form.expectedDeliveryDate,
      orderDate: new Date().toISOString(),
      medicines: formattedMedicines,
      orderStatus: form.orderStatus,
      actualDeliveryDate: form.orderStatus === "Completed" ? new Date().toISOString() : null,
    };

    try {
      await axios.post("http://localhost:5001/api/supplierorders", requestData);
      setForm({
        supplierId: "",
        expectedDeliveryDate: "",
        medicines: "",
        orderStatus: "Pending",
      });
      
      setTimeout(() => navigate("/orders"), 1500);
      // Refresh orders after successful submission
      await fetchOrders();
    } catch (err) {
      setError("Error saving order. Please try again.");
      console.error("Submission Error:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Supplier Order Form
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier ID */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Supplier ID</label>
          <input
            type="text"
            name="supplierId"
            placeholder="Enter Supplier ID"
            value={form.supplierId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Expected Delivery Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Expected Delivery Date</label>
          <input
            type="date"
            name="expectedDeliveryDate"
            value={form.expectedDeliveryDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Medicines Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Medicines (Comma Separated)
          </label>
          <textarea
            name="medicines"
            placeholder="Enter medicine IDs separated by commas (e.g., MED001, MED002)"
            value={form.medicines}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">Example: Paracetamol-500, Amoxicillin-250</p>
        </div>

        {/* Order Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Order Status</label>
          <select
            name="orderStatus"
            value={form.orderStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Create Order"
          )}
        </button>
      </form>
    </div>
  );
};

export default SupplierOrder;
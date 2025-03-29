import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupplierOrder = ({ fetchOrders }) => {
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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      setForm({ supplierId: "", expectedDeliveryDate: "", medicines: "", orderStatus: "Pending" });
      fetchOrders();
    } catch (err) {
      setError("Error saving order.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Supplier Order Form
      </h1>

      {error && <p className="text-red-600 text-center font-medium mb-4">{error}</p>}
      {loading && <p className="text-center text-gray-500 font-medium mb-4">Processing...</p>}

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
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Order"}
        </button>
      </form>
    </div>
  );
};

export default SupplierOrder;

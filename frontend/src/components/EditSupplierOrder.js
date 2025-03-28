import React, { useState, useEffect } from "react";
import axios from "axios";

const EditSupplierOrder = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    supplierId: "",
    expectedDeliveryDate: "",
    medicines: "",
    orderStatus: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/supplierorders/${orderId}`);
        setOrder(response.data);
        setForm({
          supplierId: response.data.supplierId,
          expectedDeliveryDate: response.data.expectedDeliveryDate,
          medicines: response.data.medicines.map((med) => med.medicineId).join(", "),
          orderStatus: response.data.orderStatus,
        });
      } catch (err) {
        setError("Error fetching order details.");
        console.error(err);
      }
      setLoading(false);
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedMedicines = form.medicines
      ? form.medicines.split(",").map((med) => ({
          medicineId: med.trim(),
          orderedQuantity: 1, // Default quantity
          receivedQuantity: 0,
          totalAmount: 100, // Example price
        }))
      : [];

    const requestData = {
      medicines: formattedMedicines,
      orderStatus: form.orderStatus,
      expectedDeliveryDate: form.expectedDeliveryDate,
    };

    try {
      await axios.put(`http://localhost:5001/api/supplierorders/${orderId}`, requestData);
      onClose(); // Close the modal or the update form
    } catch (err) {
      setError("Error updating order.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    }
  };

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Update Supplier Order</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="supplierId"
            placeholder="Supplier ID"
            value={form.supplierId}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="date"
            name="expectedDeliveryDate"
            value={form.expectedDeliveryDate}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <input
          type="text"
          name="medicines"
          placeholder="Medicines (comma separated)"
          value={form.medicines}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="orderStatus"
          value={form.orderStatus}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Update Order
        </button>
      </form>
    </div>
  );
};

export default EditSupplierOrder;

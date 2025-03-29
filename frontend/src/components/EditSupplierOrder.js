import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSupplierOrder = ({ fetchOrders }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    supplierId: "",
    expectedDeliveryDate: "",
    medicines: "",
    orderStatus: "Pending",
    orderId: "",
    actualDeliveryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/supplierorders/${id}`);
        const order = response.data;
        
        // Format medicines for display
        const medicinesString = order.medicines.map(med => med.medicineId).join(", ");
        
        setForm({
          supplierId: order.supplierId,
          expectedDeliveryDate: order.expectedDeliveryDate.split('T')[0],
          medicines: medicinesString,
          orderStatus: order.orderStatus,
          orderId: order.orderId,
          actualDeliveryDate: order.actualDeliveryDate ? order.actualDeliveryDate.split('T')[0] : "",
        });
      } catch (err) {
        setError("Error loading order data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      medicines: formattedMedicines,
      orderStatus: form.orderStatus,
      actualDeliveryDate: form.orderStatus === "Completed" ? (form.actualDeliveryDate || new Date().toISOString()) : null,
    };

    try {
      setLoading(true);
      await axios.put(`http://localhost:5001/api/supplierorders/${form.orderId}`, requestData);
      navigate("/orders");
      if (fetchOrders) fetchOrders();
    } catch (err) {
      setError("Error updating order.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Supplier Order</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center text-gray-500">Loading order data...</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Order ID</label>
            <input
              type="text"
              name="orderId"
              value={form.orderId}
              readOnly
              className="border border-gray-300 p-3 rounded-lg w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Supplier ID</label>
            <input
              type="text"
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Expected Delivery Date</label>
          <input
            type="date"
            name="expectedDeliveryDate"
            value={form.expectedDeliveryDate}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Medicines (comma separated)</label>
          <input
            type="text"
            name="medicines"
            placeholder="Medicine1, Medicine2, Medicine3"
            value={form.medicines}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Order Status</label>
          <select
            name="orderStatus"
            value={form.orderStatus}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {form.orderStatus === "Completed" && (
          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Actual Delivery Date</label>
            <input
              type="date"
              name="actualDeliveryDate"
              value={form.actualDeliveryDate}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Update Order
        </button>
      </form>
    </div>
  );
};

export default EditSupplierOrder;
import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/supplierorders");
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error(err);
    }
    setLoading(false);
  };

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
      orderDate: new Date().toISOString(),
      medicines: formattedMedicines,
      orderStatus: form.orderStatus,
      actualDeliveryDate: form.orderStatus === "Completed" ? new Date().toISOString() : null,
    };

    try {
      if (form.orderId) {
        await axios.put(`http://localhost:5001/api/supplierorders/${form.orderId}`, requestData);
        setForm({ supplierId: "", expectedDeliveryDate: "", medicines: "", orderStatus: "Pending", orderId: "", actualDeliveryDate: "" });
      } else {
        await axios.post("http://localhost:5001/api/supplierorders", requestData);
      }
      fetchOrders();
    } catch (err) {
      setError("Error saving order.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5001/api/supplierorders/${orderId}`);
      fetchOrders();
    } catch (err) {
      setError("Error deleting order.");
      console.error(err);
    }
  };

  const handleEdit = (order) => {
    setForm({
      supplierId: order.supplierId,
      expectedDeliveryDate: order.expectedDeliveryDate,
      medicines: order.medicines.map((med) => med.medicineId).join(", "),
      orderStatus: order.orderStatus,
      orderId: order._id,
      actualDeliveryDate: order.actualDeliveryDate || "",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto"> {/* Increased the width of the container */}
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Supplier Orders</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center text-gray-500">Loading orders...</p>}

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
          {form.orderId ? "Update Order" : "Add Order"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Supplier ID</th>
              <th className="py-3 px-6 text-left">Order Date</th>
              <th className="py-3 px-6 text-left">Expected Delivery</th>
              <th className="py-3 px-6 text-left">Actual Delivery</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{order.orderId}</td>
                <td className="py-3 px-6">{order.supplierId}</td>
                <td className="py-3 px-6">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-3 px-6">{new Date(order.expectedDeliveryDate).toLocaleDateString()}</td>
                <td className="py-3 px-6">
                  {order.orderStatus === "Completed" ? (
                    order.actualDeliveryDate ? new Date(order.actualDeliveryDate).toLocaleDateString() : "Not Available"
                  ) : "-"}
                </td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.orderStatus === "Pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : order.orderStatus === "Completed"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-3 px-6 flex space-x-2">
                  <button onClick={() => handleEdit(order)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(order._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierOrders;

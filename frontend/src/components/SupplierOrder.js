import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierOrders = () => {
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
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/supplierorders");
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
  
    // Convert medicines input to proper format
    const formattedMedicines = form.medicines
      ? form.medicines.split(",").map((med) => ({
          medicineId: med.trim(),
          orderedQuantity: 1, // Default quantity (Change if required)
          receivedQuantity: 0,
          totalAmount: 100 // Set an example price (Adjust as needed)
        }))
      : [];
  
    const requestData = {
      supplierId: form.supplierId,
      expectedDeliveryDate: form.expectedDeliveryDate,
      orderDate: new Date().toISOString(),
      medicines: formattedMedicines,
      orderStatus: form.orderStatus,
    };
  
    try {
      await axios.post("http://localhost:5000/api/supplierorders", requestData);
      setForm({ supplierId: "", expectedDeliveryDate: "", medicines: "", orderStatus: "Pending" });
      fetchOrders();
    } catch (err) {
      setError("Error adding order. Check console for details.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    }
  };
  

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/supplierorders/${orderId}`);
      fetchOrders();
    } catch (err) {
      setError("Error deleting order.");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supplier Orders</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading orders...</p>}

      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
        <input
          type="text"
          name="supplierId"
          placeholder="Supplier ID"
          value={form.supplierId}
          onChange={handleChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          name="expectedDeliveryDate"
          value={form.expectedDeliveryDate}
          onChange={handleChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="medicines"
          placeholder="Medicines (comma separated)"
          value={form.medicines}
          onChange={handleChange}
          className="border p-2 mr-2"
        />
        <select
          name="orderStatus"
          value={form.orderStatus}
          onChange={handleChange}
          className="border p-2 mr-2"
        >
          <option value="Pending">Pending</option>
          
          <option value="Cancelled">Delivered</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Add Order
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Supplier ID</th>
            <th className="border p-2">Order Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border p-2">{order._id}</td>
              <td className="border p-2">{order.supplierId}</td>
              <td className="border p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
              <td className="border p-2">{order.orderStatus}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(order._id)} className="bg-red-500 text-white px-2 py-1">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierOrders;

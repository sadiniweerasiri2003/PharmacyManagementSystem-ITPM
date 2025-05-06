import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SupplierOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (order) =>
          order.supplierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/supplierorders");
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/supplierorders/${orderId}`);
      // Update the state to remove the deleted order
      setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
      setFilteredOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
    } catch (err) {
      setError("Error deleting order.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Supplier Orders</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center text-gray-500">Loading orders...</p>}

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Order ID, Supplier ID, or Status"
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
            {filteredOrders.map((order) => (
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
                  <button
                    onClick={() => navigate(`/orders/edit/${order.orderId}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.orderId)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
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

export default SupplierOrderList;
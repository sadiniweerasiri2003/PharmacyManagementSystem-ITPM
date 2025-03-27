import React, { useState, useEffect } from "react";
import axios from "axios";

const PreviousSupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/supplierorders");
      const completedOrders = response.data.filter(order => order.orderStatus === "Completed");
      setOrders(completedOrders);
    } catch (err) {
      setError("Error fetching orders.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Previous Supplier Orders</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center text-gray-500">Loading orders...</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Supplier ID</th>
              <th className="py-3 px-6 text-left">Order Date</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order, index) => (
              <tr key={order._id || index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{order._id}</td>
                <td className="py-3 px-6">{order.supplierId}</td>
                <td className="py-3 px-6">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-3 px-6">
                  <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm">
                    {order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviousSupplierOrders;

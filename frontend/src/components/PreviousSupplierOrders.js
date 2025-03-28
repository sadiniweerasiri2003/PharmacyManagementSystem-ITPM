import React, { useEffect, useState } from "react";

const PreviousSupplierOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/supplierorders")
      .then((response) => response.json())
      .then((data) => {
        // Filter orders that are "Completed" or "Cancelled"
        const previousOrders = data.filter(order => 
          order.orderStatus === "Completed" || order.orderStatus === "Cancelled"
        );
        setOrders(previousOrders);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Previous Supplier Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Supplier ID</th>
              <th className="py-3 px-6 text-left">Order Date</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{order.orderId}</td>
                <td className="py-3 px-6">{order.supplierId}</td>
                <td className="py-3 px-6">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="py-3 px-6">{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviousSupplierOrder;

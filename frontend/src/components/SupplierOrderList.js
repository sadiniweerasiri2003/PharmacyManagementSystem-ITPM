import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch, FaPlusCircle, FaBoxOpen, FaFileDownload } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ShoppingBag, Clock, CheckCircle, XCircle, Calendar } from "react-feather";

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
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    try {
      await axios.delete(`http://localhost:5001/api/supplierorders/${orderId}`);
      setOrders(prev => prev.filter(order => order.orderId !== orderId));
      setFilteredOrders(prev => prev.filter(order => order.orderId !== orderId));
    } catch (err) {
      setError("Error deleting order.");
      console.error(err);
    }
  };

  const getChartData = () => {
    const statusCounts = filteredOrders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count,
      fill:
        status === "Pending"
          ? "#064e3b"
          : status === "Completed"
          ? "#064e3b"
          : "#064e3b",
    }));
  };

  const handleDownloadCSV = () => {
    const header = ["Order ID", "Supplier ID", "Order Date", "Expected Delivery Date", "Order Status"];
    const rows = filteredOrders.map((o) => [
      o.orderId,
      o.supplierId,
      new Date(o.orderDate).toLocaleDateString(),
      new Date(o.expectedDeliveryDate).toLocaleDateString(),
      o.orderStatus,
    ]);
    const csv = [header, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supplier_orders_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const Button = ({ children, className, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ShoppingBag className="mr-3 text-indigo-600" size={28} />
          <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
            Supplier Orders
          </span>
        </h1>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-to-r from-indigo-600 to-teal-600 text-white flex items-center hover:from-indigo-700 hover:to-teal-700"
            onClick={() => navigate("/orders/add")}
          >
            <FaPlusCircle className="mr-2" /> Add New Order
          </Button>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-teal-600 text-white flex items-center hover:from-indigo-700 hover:to-teal-700"
            onClick={handleDownloadCSV}
          >
            <FaFileDownload className="mr-2" /> Download Report
          </Button>
        </div>
      </div>

      {/* Status Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pending */}
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md flex items-start">
          <div className="bg-blue-50 p-3 rounded-lg mr-4">
            <Clock className="text-blue-600" size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-gray-800">
              {filteredOrders.filter(o => o.orderStatus === "Pending").length}
            </p>
            <p className="text-xs text-gray-400">Awaiting fulfillment</p>
          </div>
        </div>
        {/* Completed */}
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md flex items-start">
          <div className="bg-green-50 p-3 rounded-lg mr-4">
            <CheckCircle className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-gray-800">
              {filteredOrders.filter(o => o.orderStatus === "Completed").length}
            </p>
            <p className="text-xs text-gray-400">Successfully delivered</p>
          </div>
        </div>
        {/* Cancelled */}
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md flex items-start">
          <div className="bg-red-50 p-3 rounded-lg mr-4">
            <XCircle className="text-red-600" size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Cancelled</p>
            <p className="text-2xl font-bold text-gray-800">
              {filteredOrders.filter(o => o.orderStatus === "Cancelled").length}
            </p>
            <p className="text-xs text-gray-400">Orders cancelled</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-xl shadow-sm border mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Status Distribution</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Orders" radius={[4, 4, 0, 0]}>
                {getChartData().map((entry, index) => (
                  <cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Supplier, or Status..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-3.5 text-sm text-gray-500">
            {filteredOrders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 border-b border-red-100">{error}</div>
        )}
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-3 text-gray-500">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center">
                      <FaBoxOpen className="mr-2" size={14} />
                      Order ID
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center">
                      <Calendar className="mr-2" size={14} />
                      Order Date
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{order.orderId}</td>
                    <td className="px-6 py-4">{order.supplierId}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.orderStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/orders/edit/${order.orderId}`)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.orderId)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* No Results Message */}
      {filteredOrders.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border mt-4 text-center">
          <ShoppingBag className="mx-auto text-gray-300" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-500">No orders found</h3>
          <p className="mt-1 text-gray-400">Try adjusting your search or add a new order</p>
        </div>
      )}
    </div>
  );
};

export default SupplierOrderList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const SupplierDashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("suppliers");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Define all fetch functions
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/suppliers");
      setSuppliers(response.data);
      setFilteredData(response.data);
    } catch (err) {
      setError("Error fetching suppliers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOngoingOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/supplierorders?status=Pending");
      setOngoingOrders(response.data);
      setFilteredData(response.data);
    } catch (err) {
      setError("Error fetching ongoing orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/supplierorders?status=Completed");
      setPreviousOrders(response.data);
      setFilteredData(response.data);
    } catch (err) {
      setError("Error fetching previous orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/supplierorders");
      setAllOrders(response.data);
      setFilteredData(response.data);
    } catch (err) {
      setError("Error fetching all orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "suppliers") fetchSuppliers();
    if (activeTab === "ongoingOrders") fetchOngoingOrders();
    if (activeTab === "previousOrders") fetchPreviousOrders();
    if (activeTab === "allOrders") fetchAllOrders();
  }, [activeTab]);

  useEffect(() => {
    let dataToFilter = [];
    if (activeTab === "suppliers") dataToFilter = suppliers;
    if (activeTab === "ongoingOrders") dataToFilter = ongoingOrders;
    if (activeTab === "previousOrders") dataToFilter = previousOrders;
    if (activeTab === "allOrders") dataToFilter = allOrders;

    setFilteredData(
      dataToFilter.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        if (activeTab === "suppliers") {
          return (
            item.name.toLowerCase().includes(searchLower) ||
            item.email.toLowerCase().includes(searchLower) ||
            item.phoneNumber.toLowerCase().includes(searchLower)
          );
        } else {
          return (
            (item.supplierId || item.supplierName).toLowerCase().includes(searchLower) ||
            (item.orderId || item._id).toString().toLowerCase().includes(searchLower) ||
            (item.orderStatus || "Pending").toLowerCase().includes(searchLower)
          );
        }
      })
    );
  }, [searchTerm, activeTab, suppliers, ongoingOrders, previousOrders, allOrders]);

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm(`Are you sure you want to delete this supplier?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/suppliers/${supplierId}`);
      fetchSuppliers();
    } catch (err) {
      setError("Error deleting supplier");
      console.error(err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/supplierorders/${orderId}`);
      if (activeTab === "ongoingOrders") fetchOngoingOrders();
      if (activeTab === "previousOrders") fetchPreviousOrders();
      if (activeTab === "allOrders") fetchAllOrders();
    } catch (err) {
      setError("Error deleting order");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center text-gray-500 p-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 shadow-lg">
        <h2 className="text-xl font-bold mb-5 text-blue-800">Admin Panel</h2>
        <ul className="space-y-2">
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${
              activeTab === "suppliers"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("suppliers")}
          >
            Suppliers
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${
              activeTab === "ongoingOrders"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("ongoingOrders")}
          >
            Ongoing Orders
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${
              activeTab === "previousOrders"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("previousOrders")}
          >
            Previous Orders
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${
              activeTab === "allOrders"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("allOrders")}
          >
            All Orders
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${
              activeTab === "createOrder"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => navigate("/orders/add")}
          >
            Create New Order
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-blue-800">
              {activeTab === "suppliers" && "Suppliers"}
              {activeTab === "ongoingOrders" && "Ongoing Orders"}
              {activeTab === "previousOrders" && "Previous Orders"}
              {activeTab === "allOrders" && "All Orders"}
            </h1>
            {activeTab === "suppliers" && (
              <button
                onClick={() => navigate("/suppliers/add")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
              >
                + Create New Supplier
              </button>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold">Total Suppliers</h3>
              <p className="text-3xl font-bold text-blue-600">{suppliers.length}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold">Ongoing Orders</h3>
              <p className="text-3xl font-bold text-yellow-600">{ongoingOrders.length}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold">Completed Orders</h3>
              <p className="text-3xl font-bold text-green-600">{previousOrders.length}</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-6 flex items-center justify-between relative">
            <input
              type="text"
              placeholder={
                activeTab === "suppliers"
                  ? "Search by name, email, or phone"
                  : "Search by Order ID, Supplier ID, or Status"
              }
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-4 top-3 text-gray-500 text-sm">
              {filteredData.length} out of{" "}
              {activeTab === "suppliers"
                ? suppliers.length
                : activeTab === "ongoingOrders"
                ? ongoingOrders.length
                : activeTab === "previousOrders"
                ? previousOrders.length
                : allOrders.length}
            </span>
          </div>

          {/* Tab Content */}
          {activeTab === "suppliers" && (
            <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-md">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Phone</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {filteredData.map((supplier) => (
                    <tr key={supplier._id} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-6">{supplier.name}</td>
                      <td className="py-3 px-6">{supplier.email}</td>
                      <td className="py-3 px-6">{supplier.phoneNumber}</td>
                      <td className="py-3 px-6 flex space-x-4">
                        <button
                          onClick={() => navigate(`/suppliers/edit/${supplier._id}`)}
                          className="text-yellow-500 hover:text-yellow-700 transition duration-300"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteSupplier(supplier._id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <FaTrash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === "ongoingOrders" || activeTab === "previousOrders" || activeTab === "allOrders") && (
            <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-md">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Order ID</th>
                    <th className="py-3 px-6 text-left">Supplier</th>
                    <th className="py-3 px-6 text-left">Order Date</th>
                    <th className="py-3 px-6 text-left">Expected Delivery</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {filteredData.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-100">
                      <td className="py-3 px-6">{order.orderId || order._id}</td>
                      <td className="py-3 px-6">{order.supplierId || order.supplierName}</td>
                      <td className="py-3 px-6">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-3 px-6">
                        {order.expectedDeliveryDate
                          ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            (order.orderStatus || "Pending") === "Pending"
                              ? "bg-yellow-200 text-yellow-700"
                              : (order.orderStatus || "Pending") === "Completed"
                              ? "bg-green-200 text-green-700"
                              : "bg-red-200 text-red-700"
                          }`}
                        >
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-6 flex space-x-4">
                        <button
                          onClick={() => navigate(`/orders/edit/${order.orderId || order._id}`)}
                          className="text-yellow-500 hover:text-yellow-700 transition duration-300"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.orderId || order._id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <FaTrash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SupplierDashboard;
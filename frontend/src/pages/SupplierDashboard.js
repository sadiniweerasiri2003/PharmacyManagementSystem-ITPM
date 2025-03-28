import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("suppliers"); // Default tab
  const navigate = useNavigate();

  // Fetch suppliers and orders
  useEffect(() => {
    fetchSuppliers();
    fetchOngoingOrders();
    fetchPreviousOrders();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/suppliers");
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers", err);
    }
  };

  const fetchOngoingOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/supplierorders?status=Pending");
      setOngoingOrders(response.data);
    } catch (err) {
      console.error("Error fetching ongoing orders", err);
    }
  };

  const fetchPreviousOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/supplierorders?status=Completed");
      setPreviousOrders(response.data);
    } catch (err) {
      console.error("Error fetching previous orders", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Supplier Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage your orders and suppliers efficiently.</p>

        {/* Tab Navigation */}
        <div className="flex border-b-2 mb-6">
          <button
            className={`text-xl px-6 py-3 font-semibold transition duration-300 ${activeTab === "suppliers" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-500"}`}
            onClick={() => setActiveTab("suppliers")}
          >
            Suppliers
          </button>
          <button
            className={`text-xl px-6 py-3 font-semibold transition duration-300 ${activeTab === "ongoingOrders" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-500"}`}
            onClick={() => setActiveTab("ongoingOrders")}
          >
            Ongoing Orders
          </button>
          <button
            className={`text-xl px-6 py-3 font-semibold transition duration-300 ${activeTab === "previousOrders" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-500"}`}
            onClick={() => setActiveTab("previousOrders")}
          >
            Previous Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "suppliers" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Suppliers</h2>
            {/* Add Supplier Button */}
            <button
              onClick={() => navigate("/orders")}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition duration-300"
            >
              Create New Order
            </button>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <li key={supplier._id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-xl">{supplier.name}</h3>
                  <p className="text-gray-600">{supplier.email}</p>
                  <p className="text-gray-600">{supplier.phone}</p>
                  <button
                    onClick={() => navigate(`/edit-supplier/${supplier._id}`)} // Navigate to Edit Supplier page
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300"
                  >
                    Edit Supplier
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "ongoingOrders" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ongoing Orders</h2>
            {/* Ongoing Orders content */}
          </div>
        )}

        {activeTab === "previousOrders" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Previous Orders</h2>
            <button
              onClick={() => navigate("/previous-supplier-orders")} // Navigate to Previous Supplier Orders page
              className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition duration-300"
            >
              View Previous Orders
            </button>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousOrders.map((order) => (
                <li key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-xl">{order.supplierName}</h3>
                  <p className="text-gray-600">Order ID: {order._id}</p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  {/* Add more order details here */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default SupplierDashboard;

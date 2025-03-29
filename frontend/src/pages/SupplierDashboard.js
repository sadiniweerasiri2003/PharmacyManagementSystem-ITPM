import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SupplierOrder from "../components/SupplierOrder";

const SupplierDashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);  // New state for all orders
  const [activeTab, setActiveTab] = useState("suppliers"); // Default tab
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
    fetchOngoingOrders();
    fetchPreviousOrders();
    fetchAllOrders();  // Fetch all orders for the new tab
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

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/supplierorders");  // Assuming this endpoint fetches all orders
      setAllOrders(response.data);
    } catch (err) {
      console.error("Error fetching all orders", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-5 shadow-lg">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <ul>
          <li className={`py-2 px-4 rounded-lg cursor-pointer ${activeTab === "suppliers" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("suppliers")}>
            Suppliers
          </li>
          <li className={`py-2 px-4 rounded-lg cursor-pointer ${activeTab === "ongoingOrders" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("ongoingOrders")}>
            Ongoing Orders
          </li>
          <li className={`py-2 px-4 rounded-lg cursor-pointer ${activeTab === "previousOrders" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("previousOrders")}>
            Previous Orders
          </li>
          <li className={`py-2 px-4 rounded-lg cursor-pointer ${activeTab === "allOrders" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("allOrders")}>
            All Orders
          </li>
          <li className={`py-2 px-4 rounded-lg cursor-pointer ${activeTab === "createOrder" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("createOrder")}>
            Create New Order
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Supplier Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Suppliers</h3>
            <p className="text-3xl font-bold">{suppliers.length}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Ongoing Orders</h3>
            <p className="text-3xl font-bold">{ongoingOrders.length}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Completed Orders</h3>
            <p className="text-3xl font-bold">{previousOrders.length}</p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "suppliers" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Suppliers</h2>
            <button
              onClick={() => navigate("/orders")}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition duration-300"
            >
              All Orders
            </button>

           
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id} className="border-b">
                    <td className="p-4">{supplier.name}</td>
                    <td className="p-4">{supplier.email}</td>
                    <td className="p-4">{supplier.phone}</td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/edit-supplier/${supplier._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "ongoingOrders" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ongoing Orders</h2>
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {ongoingOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-4">{order.supplierName}</td>
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "previousOrders" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Previous Orders</h2>
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {previousOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-4">{order.supplierName}</td>
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

{activeTab === "allOrders" && (
  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Manage Orders</h2>
    
    <div className="flex space-x-6">
      <button
        onClick={() => navigate("/orders")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
      >
        View All Orders
      </button>
      
      <button
        onClick={() => navigate("/orders/add")}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
      >
        + Create New Order
      </button>
    </div>
  </div>
)}



        {activeTab === "createOrder" && (
          <li className={`py-2 px-4 rounded-lg cursor-pointer ${activeTab === "createOrder" ? "bg-blue-500 text-white" : "text-gray-700"}`} 
          onClick={() => navigate("/orders/add")}> {/* Navigate to /orders */}
          Create New Order
        </li>
        
        )}
      </main>
    </div>
  );
};

export default SupplierDashboard;

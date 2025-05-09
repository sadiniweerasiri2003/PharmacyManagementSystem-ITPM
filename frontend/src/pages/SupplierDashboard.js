import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch, FaPlusCircle, FaBoxOpen, FaFileDownload } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ShoppingBag, Clock, CheckCircle, XCircle, Calendar, Users, Truck } from "react-feather";

const SupplierDashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
    fetchOngoingOrders();
    fetchPreviousOrders();
    fetchAllOrders();
  }, []);

  useEffect(() => {
    setFilteredSuppliers(
      suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, suppliers]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/suppliers");
      setSuppliers(response.data);
      setFilteredSuppliers(response.data);
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
    } catch (err) {
      setError("Error fetching all orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5001/api/suppliers/${supplierId}`);
      setSuppliers(prev => prev.filter(s => s._id !== supplierId));
      setFilteredSuppliers(prev => prev.filter(s => s._id !== supplierId));
    } catch (err) {
      if (err.response?.status === 404) {
        setSuppliers(prev => prev.filter(s => s._id !== supplierId));
        setFilteredSuppliers(prev => prev.filter(s => s._id !== supplierId));
        setError('Supplier was already deleted');
      } else {
        setError('Failed to delete supplier');
        console.error('Delete error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    const statusCounts = {
      "Suppliers": suppliers.length,
      "Ongoing Orders": ongoingOrders.length,
      "Completed Orders": previousOrders.length
    };

    return Object.entries(statusCounts).map(([name, count]) => ({
      name,
      count,
      fill: name === "Suppliers" ? "#064e3b" : name === "Ongoing Orders" ? "#064e3b" : "#064e3b"
    }));
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
          <Users className="mr-3 text-indigo-600" size={28} />
          <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
            Supplier Dashboard
          </span>
        </h1>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-to-r from-indigo-600 to-teal-600 text-white flex items-center hover:from-indigo-700 hover:to-teal-700"
            onClick={() => navigate("/suppliers/add")}
          >
            <FaPlusCircle className="mr-2" /> Add New Supplier
          </Button>
        </div>
      </div>

      {/* Status Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Suppliers */}
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md flex items-start">
          <div className="bg-indigo-50 p-3 rounded-lg mr-4">
            <Users className="text-indigo-600" size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Suppliers</p>
            <p className="text-2xl font-bold text-gray-800">
              {suppliers.length}
            </p>
            <p className="text-xs text-gray-400">Active suppliers</p>
          </div>
        </div>
        {/* Ongoing Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md flex items-start">
          <div className="bg-blue-50 p-3 rounded-lg mr-4">
            <Clock className="text-blue-600" size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ongoing Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {ongoingOrders.length}
            </p>
            <p className="text-xs text-gray-400">Pending fulfillment</p>
          </div>
        </div>
        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md flex items-start">
          <div className="bg-green-50 p-3 rounded-lg mr-4">
            <CheckCircle className="text-green-600" size={22} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Completed Orders</p>
            <p className="text-2xl font-bold text-gray-800">
              {previousOrders.length}
            </p>
            <p className="text-xs text-gray-400">Successfully delivered</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-xl shadow-sm border mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
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
            placeholder="Search suppliers by name, email or phone..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-3.5 text-sm text-gray-500">
            {filteredSuppliers.length} suppliers
          </span>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 border-b border-red-100">{error}</div>
        )}
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-3 text-gray-500">Loading suppliers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div className="flex items-center">
                      <Users className="mr-2" size={14} />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.email}</td>
                    <td className="px-6 py-4">{supplier.phoneNumber}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {supplier.address || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/suppliers/edit/${supplier._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSupplier(supplier._id)}
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
      {filteredSuppliers.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border mt-4 text-center">
          <Users className="mx-auto text-gray-300" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-500">No suppliers found</h3>
          <p className="mt-1 text-gray-400">Try adjusting your search or add a new supplier</p>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
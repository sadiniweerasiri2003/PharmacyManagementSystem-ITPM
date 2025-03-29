import React, { useState, useEffect } from "react";
import axios from "axios";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    leadTimeDays: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/suppliers");
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5001/api/suppliers", form);
      setForm({ name: "", phoneNumber: "", email: "", address: "", leadTimeDays: 0 });
      setSuccess("Supplier added successfully!");
      fetchSuppliers();
    } catch (err) {
      setError("Error saving supplier. Please try again.");
      console.error("API Error:", err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (supplierId) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/suppliers/${supplierId}`);
      setSuccess("Supplier deleted successfully!");
      fetchSuppliers();
    } catch (err) {
      setError("Error deleting supplier.");
      console.error("Error:", err.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Supplier Management</h1>

      {error && <p className="text-red-600 text-center font-medium mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center font-medium mb-4">{success}</p>}

      {/* Supplier Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Supplier Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="leadTimeDays"
          placeholder="Lead Time (Days)"
          value={form.leadTimeDays}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Supplier"}
        </button>
      </form>

      {/* Suppliers Table */}
      {suppliers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Supplier ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.supplierId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{supplier.supplierId}</td>
                  <td className="border border-gray-300 px-4 py-2">{supplier.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{supplier.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{supplier.phoneNumber}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(supplier.supplierId)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No suppliers found.</p>
      )}
    </div>
  );
};

export default SupplierManagement;

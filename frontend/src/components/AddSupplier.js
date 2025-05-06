import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSupplier = () => {
  const navigate = useNavigate();
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
      setTimeout(() => navigate("/suppliers"), 1500);
    } catch (err) {
      setError("Error saving supplier. Please try again.");
      console.error("API Error:", err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add New Supplier</h1>
      
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => navigate("/suppliers")}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          View Suppliers
        </button>
      </div>

      {error && <p className="text-red-600 text-center font-medium mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center font-medium mb-4">{success}</p>}

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
    </div>
  );
};

export default AddSupplier;
import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Package, PlusCircle, ShoppingCart } from "lucide-react";

const stockData = [
  { name: "Painkillers", stock: 120 },
  { name: "Antibiotics", stock: 80 },
  { name: "Vitamins", stock: 150 },
  { name: "Cough Syrup", stock: 60 },
];

export default function InventoryDashboard() {
  const [formData, setFormData] = useState({
    medicineId: "",
    name: "",
    batchNumber: "",
    expiryDate: "",
    price: "",
    quantity: "",
    restockedDate: "",
    supplierId: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Medicine added successfully!" });

        setFormData({
          medicineId: "",
          name: "",
          batchNumber: "",
          expiryDate: "",
          price: "",
          quantity: "",
          restockedDate: "",
          supplierId: "",
        });
      } else {
        setMessage({ type: "error", text: "Failed to add medicine." });
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      setMessage({ type: "error", text: "An error occurred. Try again!" });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Pharmacy Inventory Dashboard</h1>

      <div className="bg-white p-6 shadow-lg rounded-2xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Medicine</h2>

        {message && (
          <div className={`p-2 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Medicine ID</label>
            <input type="text" name="medicineId" value={formData.medicineId} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input type="text" name="name" value={formData.name} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1">Batch Number</label>
            <input type="text" name="batchNumber" value={formData.batchNumber} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Expiry Date</label>
            <input type="date" name="expiryDate" value={formData.expiryDate} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input type="number" name="price" value={formData.price} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Last Restocked Date</label>
            <input type="date" name="restockedDate" value={formData.restockedDate} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Supplier ID</label>
            <input type="text" name="supplierId" value={formData.supplierId} className="p-2 border rounded w-full" onChange={handleChange} required />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md w-full">
              Add Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

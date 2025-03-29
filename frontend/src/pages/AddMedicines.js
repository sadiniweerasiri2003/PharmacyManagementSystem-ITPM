import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddMedicines = () => {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]); // Add this state for suppliers

  // Generate Medicine ID
  const generateMedicineId = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/medicines");
      const medicines = await response.json();
      const lastMedicine = medicines[medicines.length - 1];
      const lastId = lastMedicine ? parseInt(lastMedicine.medicineId.replace('MED', '')) : 0;
      const newId = (lastId + 1).toString().padStart(4, '0');
      return `MED${newId}`;
    } catch (error) {
      return 'MED0001'; // Fallback if no medicines exist
    }
  };

  // Generate Batch Number
  const generateBatchNumber = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/medicines");
      const medicines = await response.json();
      const lastMedicine = medicines[medicines.length - 1];
      const lastBatch = lastMedicine ? parseInt(lastMedicine.batchNumber.replace('B', '')) : 0;
      const newBatch = (lastBatch + 1).toString().padStart(4, '0');
      return `B${newBatch}`;
    } catch (error) {
      return 'B0001'; // Fallback if no medicines exist
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      const medicineId = await generateMedicineId();
      const batchNumber = await generateBatchNumber();
      setFormData(prev => ({
        ...prev,
        medicineId,
        batchNumber
      }));
    };
    initializeForm();
    fetchSuppliers(); // Add this function call
  }, []);

  // Add this function to fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/suppliers");
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        setMessage({ type: 'error', text: "Failed to fetch suppliers." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Error fetching suppliers." });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await fetch("http://localhost:5001/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: "✅ Medicine added successfully!" });
        setTimeout(() => navigate("/inventory-dashboard"), 1500);
      } else {
        // Handle specific error for duplicate medicine name
        if (data.field === 'name') {
          setErrors({ name: data.message });
        }
        setMessage({ type: 'error', text: "❌ " + data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "❌ Error adding medicine." });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 shadow-lg rounded-2xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Medicine</h2>

        {message && (
          <div className={`p-2 mb-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Medicine ID</label>
            <input
              type="text"
              name="medicineId"
              value={formData.medicineId}
              className="p-2 border rounded w-full bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Batch Number</label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              className="p-2 border rounded w-full bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`p-2 border rounded w-full ${errors.name ? 'border-red-500' : ''}`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Last Restocked Date</label>
            <input
              type="date"
              name="restockedDate"
              value={formData.restockedDate}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Supplier</label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">Select a Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.name} ({supplier.supplierId})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicines;

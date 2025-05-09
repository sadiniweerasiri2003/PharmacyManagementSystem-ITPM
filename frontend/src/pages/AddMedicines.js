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
  const [showPopup, setShowPopup] = useState(false);

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
        setShowPopup(true); // Show popup on success
        setMessage({ type: 'success', text: "✅ Medicine added successfully!" });
        setTimeout(() => {
          setShowPopup(false);
          navigate("/inventory-dashboard");
        }, 2000);
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
    <div className="p-8 bg-[#f5fff2] min-h-screen relative">
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl transform transition-all animate-popup">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B5E20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1B5E20] mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">Medicine has been added successfully.</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div className="h-2 bg-[#1B5E20] rounded-full animate-progress"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-[#1B5E20] mb-8 text-center">Add New Medicine</h2>

        {message && (
          <div className={`p-4 mb-6 rounded-lg text-center text-lg font-medium ${
            message.type === 'success' 
              ? 'bg-green-50 text-[#1B5E20] border-2 border-[#1B5E20]/20' 
              : 'bg-red-50 text-red-700 border-2 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Medicine ID</label>
            <input
              type="text"
              name="medicineId"
              value={formData.medicineId}
              className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Batch Number</label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Medicine Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border-2 ${errors.name ? 'border-red-500' : 'border-[#1B5E20]/20'} rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Unit Price (LKR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Stock Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Last Restocked Date</label>
            <input
              type="date"
              name="restockedDate"
              value={formData.restockedDate}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#1B5E20] font-semibold text-sm uppercase tracking-wider">Select Supplier</label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="w-full p-3 border-2 border-[#1B5E20]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent transition-all"
              required
            >
              <option value="">Choose a supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.name} ({supplier.supplierId})
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 pt-6">
            <button
              type="submit"
              className="w-full bg-[#1B5E20] text-white py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-[#1B5E20]/90 transform hover:scale-[1.02] transition-all duration-200"
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

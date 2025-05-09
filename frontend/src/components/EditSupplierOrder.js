import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";

const EditSupplierOrder = ({ fetchOrders }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    supplierId: "",
    expectedDeliveryDate: "",
    medicines: "",
    orderStatus: "Pending",
    orderId: "",
    actualDeliveryDate: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/supplierorders/${id}`);
        const order = response.data;
        
        const medicinesString = order.medicines.map(med => med.medicineId).join(", ");
        
        setForm({
          supplierId: order.supplierId,
          expectedDeliveryDate: order.expectedDeliveryDate.split('T')[0],
          medicines: medicinesString,
          orderStatus: order.orderStatus,
          orderId: order.orderId,
          actualDeliveryDate: order.actualDeliveryDate ? order.actualDeliveryDate.split('T')[0] : "",
        });
      } catch (err) {
        setError("Error loading order data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveryDate = form.expectedDeliveryDate ? new Date(form.expectedDeliveryDate) : null;
    
    if (deliveryDate) deliveryDate.setHours(0, 0, 0, 0);

    // Supplier ID validation
    if (!form.supplierId.trim()) {
      newErrors.supplierId = "Supplier ID is required";
    } else if (!/^[A-Z0-9-]+$/.test(form.supplierId)) {
      newErrors.supplierId = "Supplier ID can only contain uppercase letters, numbers and hyphens";
    }

    // Expected Delivery Date validation
    if (!form.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = "Delivery date is required";
    } else {
      // For Pending status, date must be in future
      if (form.orderStatus === "Pending" && deliveryDate <= today) {
        newErrors.expectedDeliveryDate = "Pending orders must have future delivery dates";
      }
      // For Completed status, date must be in past
      if (form.orderStatus === "Completed" && deliveryDate > today) {
        newErrors.expectedDeliveryDate = "Completed orders must have past delivery dates";
      }
    }

    // Medicines validation
    if (!form.medicines.trim()) {
      newErrors.medicines = "At least one medicine is required";
    } else {
      const medicineArray = form.medicines.split(",").map(m => m.trim());
      if (medicineArray.some(m => !m)) {
        newErrors.medicines = "Invalid medicine format (empty values between commas)";
      }
    }

    // Actual Delivery Date validation if status is Completed
    if (form.orderStatus === "Completed" && !form.actualDeliveryDate) {
      newErrors.actualDeliveryDate = "Actual delivery date is required for completed orders";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert to uppercase for supplierId and medicines
    if (name === "supplierId" || name === "medicines") {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }

    // Additional validation when changing status or date
    if (name === "orderStatus" || name === "expectedDeliveryDate") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deliveryDate = new Date(form.expectedDeliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);

      if (value === "Completed" && deliveryDate > today) {
        setErrors({
          ...errors,
          expectedDeliveryDate: "Cannot complete an order with future delivery date"
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formattedMedicines = form.medicines
      .split(",")
      .map((med) => med.trim())
      .filter(med => med)
      .map((med) => ({
        medicineId: med,
        orderedQuantity: 1,
        receivedQuantity: 0,
        totalAmount: 100,
      }));

    const requestData = {
      supplierId: form.supplierId,
      expectedDeliveryDate: form.expectedDeliveryDate,
      medicines: formattedMedicines,
      orderStatus: form.orderStatus,
      actualDeliveryDate: form.orderStatus === "Completed" ? 
        (form.actualDeliveryDate || new Date().toISOString()) : 
        null,
    };

    try {
      setLoading(true);
      await axios.put(`http://localhost:5001/api/supplierorders/${form.orderId}`, requestData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate("/orders");
        if (fetchOrders) fetchOrders();
        setIsSubmitted(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating order. Please try again.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if selected date is in future
  const isFutureDate = () => {
    if (!form.expectedDeliveryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveryDate = new Date(form.expectedDeliveryDate);
    deliveryDate.setHours(0, 0, 0, 0);
    return deliveryDate > today;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Edit Supplier Order
            </h1>
            <p className="text-blue-100 mt-1">
              Update order details and status
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" size={20} />
                <div>
                  <h3 className="font-medium text-green-800">Order updated successfully!</h3>
                  <p className="text-sm text-green-600 mt-1">Redirecting to orders page...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <FaInfoCircle className="text-red-500 mr-3 mt-0.5" size={18} />
                <div>
                  <h3 className="font-medium text-red-800">Error updating order</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order ID (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={form.orderId}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  />
                </div>

                {/* Supplier ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="supplierId"
                      placeholder="SUP001"
                      value={form.supplierId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.supplierId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm uppercase`}
                      style={{ textTransform: 'uppercase' }}
                      required
                    />
                    {errors.supplierId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaInfoCircle className="mr-1" size={12} />
                        {errors.supplierId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Expected Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    value={form.expectedDeliveryDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.expectedDeliveryDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm`}
                    required
                  />
                  {errors.expectedDeliveryDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaInfoCircle className="mr-1" size={12} />
                      {errors.expectedDeliveryDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Medicines Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicines <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="medicines"
                    placeholder="MED001, MED002, MED003"
                    value={form.medicines}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border ${errors.medicines ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm resize-none uppercase`}
                    style={{ textTransform: 'uppercase' }}
                  ></textarea>
                  {errors.medicines ? (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaInfoCircle className="mr-1" size={12} />
                      {errors.medicines}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      Enter medicine IDs separated by commas (e.g., MED001, MED002)
                    </p>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="orderStatus"
                  value={form.orderStatus}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.orderStatus ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm`}
                  disabled={isFutureDate() && form.orderStatus === "Completed"}
                >
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                  <option 
                    value="Completed" 
                    disabled={isFutureDate()}
                  >
                    Completed
                  </option>
                </select>
                {errors.orderStatus && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaInfoCircle className="mr-1" size={12} />
                    {errors.orderStatus}
                  </p>
                )}
                {isFutureDate() && form.orderStatus === "Completed" && (
                  <p className="mt-1 text-sm text-yellow-600 flex items-center">
                    <FaInfoCircle className="mr-1" size={12} />
                    Change delivery date to today or earlier to mark as Completed
                  </p>
                )}
              </div>

              {/* Actual Delivery Date (conditionally shown) */}
              {form.orderStatus === "Completed" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="actualDeliveryDate"
                      value={form.actualDeliveryDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border ${errors.actualDeliveryDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm`}
                    />
                    {errors.actualDeliveryDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaInfoCircle className="mr-1" size={12} />
                        {errors.actualDeliveryDate}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || (isFutureDate() && form.orderStatus === "Completed")}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Order"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSupplierOrder;
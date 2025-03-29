import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupplierOrder = ({ fetchOrders }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    supplierId: "",
    expectedDeliveryDate: "",
    medicines: "",
    orderStatus: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/supplierorders");
      setOrders(response.data);
    } catch (err) {
      setError("Error fetching orders.");
      console.error(err);
    }
    setLoading(false);
  };

  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedMedicines = form.medicines
      ? form.medicines.split(",").map((med) => ({
          medicineId: med.trim(),
          orderedQuantity: 1,
          receivedQuantity: 0,
          totalAmount: 100,
        }))
      : [];

    const requestData = {
      supplierId: form.supplierId,
      expectedDeliveryDate: form.expectedDeliveryDate,
      orderDate: new Date().toISOString(),
      medicines: formattedMedicines,
      orderStatus: form.orderStatus,
      actualDeliveryDate: form.orderStatus === "Completed" ? new Date().toISOString() : null,
    };

    try {
      await axios.post("http://localhost:5001/api/supplierorders", requestData);
      setForm({ supplierId: "", expectedDeliveryDate: "", medicines: "", orderStatus: "Pending" });
      fetchOrders();
    } catch (err) {
      setError("Error saving order.");
      console.error("API Error:", err.response ? err.response.data : err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Supplier Order</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center text-gray-500">Saving order...</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="supplierId"
            placeholder="Supplier ID"
            value={form.supplierId}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="date"
            name="expectedDeliveryDate"
            value={form.expectedDeliveryDate}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <input
          type="text"
          name="medicines"
          placeholder="Medicines (comma separated)"
          value={form.medicines}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="orderStatus"
          value={form.orderStatus}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Create Order
        </button>
      </form>
    </div>
  );
};

export default SupplierOrder;
import React, { useState, useEffect } from "react";

const BillingForm = () => {
  const [formData, setFormData] = useState({
    medicineId: "",
    qty_sold: "",
    unitprice: "",
    totalprice: 0,
    payment_type: "Cash",
    cashier_id: ""
  });

  const [salesRecords, setSalesRecords] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState(null);

  // Fetch sales records from backend
  const fetchSalesRecords = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/sales/today");
      if (response.ok) {
        const sales = await response.json();
        setSalesRecords(sales);
      } else {
        alert("Failed to load sales records.");
      }
    } catch (error) {
      console.error("Error fetching sales records:", error);
    }
  };

  useEffect(() => {
    fetchSalesRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "qty_sold" || name === "unitprice") {
      updatedData.totalprice = updatedData.qty_sold * updatedData.unitprice || 0;
    }

    setFormData(updatedData);
  };

  // Create or Update sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editMode
        ? `http://localhost:5001/api/sales/${editInvoiceId}`
        : "http://localhost:5001/api/sales";

      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editMode ? "Sale updated successfully!" : "Sale recorded successfully!");
        setFormData({
          medicineId: "",
          qty_sold: "",
          unitprice: "",
          totalprice: 0,
          payment_type: "Cash",
          cashier_id: ""
        });
        setEditMode(false);
        setEditInvoiceId(null);
        fetchSalesRecords();
      } else {
        alert("Failed to process sale.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Delete a sale
  const handleDelete = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/sales/${invoiceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Sale deleted successfully!");
        fetchSalesRecords();
      } else {
        alert("Failed to delete sale.");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  // Edit a sale (pre-fill form)
  const handleEdit = (sale) => {
    const { invoiceId, ...saleData } = sale; // Exclude invoiceId from form data
    setFormData(saleData);
    setEditMode(true);
    setEditInvoiceId(invoiceId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Billing Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="medicineId" placeholder="Medicine ID" value={formData.medicineId} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="number" name="qty_sold" placeholder="Quantity Sold" value={formData.qty_sold} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="number" name="unitprice" placeholder="Unit Price" value={formData.unitprice} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="totalprice" value={formData.totalprice} readOnly className="w-full p-2 border rounded bg-gray-100" />
        
        <select name="payment_type" value={formData.payment_type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
        </select>

        <input type="text" name="cashier_id" placeholder="Cashier ID" value={formData.cashier_id} onChange={handleChange} required className="w-full p-2 border rounded" />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          {editMode ? "Update Sale" : "Save Sale"}
        </button>
        <button type="button" className="w-full bg-green-500 text-white py-2 rounded mt-2" onClick={() => window.print()}>
          Print
        </button>
      </form>

      {/* Sales Records Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Sales Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Invoice ID</th>
                <th className="border p-2">Medicine ID</th>
                <th className="border p-2">Quantity Sold</th>
                <th className="border p-2">Unit Price</th>
                <th className="border p-2">Total Price</th>
                <th className="border p-2">Payment Type</th>
                <th className="border p-2">Cashier ID</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesRecords.length > 0 ? (
                salesRecords.map((sale) => (
                  <tr key={sale.invoiceId} className="text-center">
                    <td className="border p-2">{sale.invoiceId}</td>
                    <td className="border p-2">{sale.medicineId}</td>
                    <td className="border p-2">{sale.qty_sold}</td>
                    <td className="border p-2">{sale.unitprice}</td>
                    <td className="border p-2">{sale.totalprice}</td>
                    <td className="border p-2">{sale.payment_type}</td>
                    <td className="border p-2">{sale.cashier_id}</td>
                    <td className="border p-2 flex justify-center space-x-2">
                      <button onClick={() => handleEdit(sale)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(sale.invoiceId)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="border p-2 text-center">No sales records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingForm;

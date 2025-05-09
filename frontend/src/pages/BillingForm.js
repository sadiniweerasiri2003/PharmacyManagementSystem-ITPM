import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BillingForm = () => {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState({
    medicineId: "",
    name: "",
    qty_sold: "",
    unitprice: "",
    totalprice: 0,
  });

  const [medicines, setMedicines] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [paymentType, setPaymentType] = useState("Cash");
  const cashierId = localStorage.getItem('cashierId');
  const [showForm, setShowForm] = useState(true);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSaleSubmitted, setIsSaleSubmitted] = useState(false);

  // Fetch available medicine names when the component mounts
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/medicine-names/getallnames");
        const data = await response.json();
        setAvailableMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    if (!cashierId) {
      alert("No cashier ID found. Please login again.");
      navigate('/login');
    }
  }, [cashierId, navigate]);

  // Fetch medicine details when selecting from dropdown
  const handleMedicineSelect = async (selectedName) => {
    if (!selectedName) return;
  
    try {      const response = await fetch(`http://localhost:5001/api/medicine-names/getauto?name=${encodeURIComponent(selectedName)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data && data.medicineId && data.price) {
        setMedicine({
          medicineId: data.medicineId,
          name: selectedName,
          qty_sold: "",
          unitprice: data.price,
          totalprice: 0,
        });
      } else {
        alert("Medicine not found!");
      }
    } catch (error) {
      console.error("Error fetching medicine details:", error);
    }
  };
  

  // Handle changes in medicine input fields
  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    const updatedMedicine = { ...medicine, [name]: value };

    // Calculate total price when qty_sold or unitprice changes
    if (name === "qty_sold" || name === "unitprice") {
      updatedMedicine.totalprice = (updatedMedicine.qty_sold * updatedMedicine.unitprice) || 0;
    }

    setMedicine(updatedMedicine);
  };

  // Add medicine to the list
  const addMedicine = () => {
    if (!medicine.medicineId || !medicine.name || !medicine.qty_sold || !medicine.unitprice) {
      alert("Please fill in all medicine details.");
      return;
    }
    setMedicines([...medicines, medicine]);
    setMedicine({ medicineId: "", name: "", qty_sold: "", unitprice: "", totalprice: 0 });
    setShowForm(false);
  };

  const addMoreMedicine = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (medicines.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicines,
          payment_type: paymentType,
          cashier_id: cashierId
        }),
      });

      if (response.ok) {
        alert("Sale recorded successfully!");
        setMedicines([]);
        setPaymentType("Cash");
        setIsCheckout(false);
        setIsSaleSubmitted(true);
      } else {
        alert("Failed to process sale.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const calculateTotalPrice = () => {
    return medicines.reduce((sum, med) => sum + med.totalprice, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Billing Form</h2>
        <button
          onClick={() => navigate('/sales')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Sales History
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-6">
        {/* Left Section: Enter Medicine Details */}
        <div className="flex-1 space-y-4">
          {showForm ? (
            <>
              <h3 className="text-lg font-semibold">Enter Medicine Details:</h3>
              <div className="space-y-4">
                {/* Medicine Name Input with Datalist */}
                <input
                  type="text"
                  name="name"
                  placeholder="Search Medicine Name"
                  value={medicine.name}
                  onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
                  onBlur={(e) => handleMedicineSelect(e.target.value)}
                  list="medicineList"
                  className="w-full p-2 border rounded"
                  required
                />
                <datalist id="medicineList">
                  {availableMedicines.map((med) => (
                    <option key={med._id} value={med.name} data-id={med._id} />
                  ))}
                </datalist>

                {/* Medicine ID (Read-Only) */}
                <input
                  type="text"
                  name="medicineId"
                  placeholder="Medicine ID"
                  value={medicine.medicineId}
                  onChange={handleMedicineChange}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />

                {/* Quantity Sold */}
                <input
                  type="number"
                  name="qty_sold"
                  placeholder="Quantity Sold"
                  value={medicine.qty_sold}
                  onChange={handleMedicineChange}
                  required
                  className="w-full p-2 border rounded"
                />

                {/* Unit Price */}
                <input
                  type="number"
                  name="unitprice"
                  placeholder="Unit Price"
                  value={medicine.unitprice}
                  onChange={handleMedicineChange}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />

                {/* Total Price (Read-Only) */}
                <input
                  type="text"
                  name="totalprice"
                  value={medicine.totalprice}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </div>

              {/* Add Medicine Button */}
              <button
                type="button"
                className="w-full bg-green-500 text-white py-2 rounded"
                onClick={addMedicine}
              >
                Add Medicine
              </button>
            </>
          ) : (
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={addMoreMedicine}
            >
              Add More Medicine
            </button>
          )}
        </div>

        {/* Right Section: Show Medicines List */}
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-semibold">Medicines Added:</h3>
          <ul className="list-disc pl-5">
            {medicines.map((med, index) => (
              <li key={index} className="text-gray-700">
                {med.name} - {med.qty_sold} x ${med.unitprice.toFixed(2)} = ${med.totalprice.toFixed(2)}
              </li>
            ))}
          </ul>

          {medicines.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-[#1B5E20]/20">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Items Total:</span>
                <span className="font-bold text-[#1B5E20]">${calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          )}

          {medicines.length > 0 && !isCheckout && (
            <button
              type="button"
              className="w-full bg-[#1B5E20] text-white py-3 rounded-lg hover:bg-[#1B5E20]/90 transition-all duration-200 mt-4"
              onClick={() => setIsCheckout(true)}
            >
              Checkout
            </button>
          )}

          {isCheckout && (
            <div className="space-y-2 mt-4">
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
              </select>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Proceed Sale
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BillingForm;

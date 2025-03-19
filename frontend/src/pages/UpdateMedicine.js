import React, { useState, useEffect } from "react";

const UpdateMedicine = () => {
  const [medicines, setMedicines] = useState([]); // Store all medicines
  const [selectedId, setSelectedId] = useState(""); // Track selected medicine
  const [medicine, setMedicine] = useState(null); // Store selected medicine details
  const [message, setMessage] = useState("");

  // Fetch all medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/medicines");
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setMedicines(data); // Store all medicines
        } else {
          setMessage("No medicines found.");
        }
      } else {
        setMessage("Failed to fetch medicines.");
      }
    } catch (error) {
      setMessage("Error fetching data.");
    }
  };

  // When user selects a medicine, fetch its details
  const handleSelectChange = (e) => {
    const selectedMedicine = medicines.find((med) => med._id === e.target.value);
    setSelectedId(e.target.value);
    setMedicine({
      ...selectedMedicine,
      expiryDate: selectedMedicine.expiryDate ? selectedMedicine.expiryDate.split("T")[0] : "",
      lastRestockedDate: selectedMedicine.lastRestockedDate ? selectedMedicine.lastRestockedDate.split("T")[0] : "",
    });
  };

  // Handle input change
  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  // Handle update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!medicine) {
      setMessage("Please select a medicine to update.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/medicines/${medicine._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicine),
      });

      if (response.ok) {
        setMessage("Medicine updated successfully!");
      } else {
        setMessage("Failed to update medicine.");
      }
    } catch (error) {
      setMessage("Error updating medicine.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Update Medicine</h2>

      {message && <p className="text-red-500">{message}</p>}

      {/* Dropdown to select medicine */}
      <label className="block mb-4">
        Select Medicine:
        <select
          className="p-2 border rounded w-full"
          value={selectedId}
          onChange={handleSelectChange}
        >
          <option value="">-- Select a Medicine --</option>
          {medicines.map((med) => (
            <option key={med._id} value={med._id}>
              {med.name} (Batch: {med.batchNumber})
            </option>
          ))}
        </select>
      </label>

      {medicine ? (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={medicine.name || ""}
              className="p-2 border rounded w-full"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Batch Number:
            <input
              type="text"
              name="batchNumber"
              value={medicine.batchNumber || ""}
              className="p-2 border rounded w-full"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Expiry Date:
            <input
              type="date"
              name="expiryDate"
              value={medicine.expiryDate || ""}
              className="p-2 border rounded w-full"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={medicine.price || ""}
              className="p-2 border rounded w-full"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={medicine.quantity || ""}
              className="p-2 border rounded w-full"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Last Restocked Date:
            <input
              type="date"
              name="lastRestockedDate"
              value={medicine.lastRestockedDate || ""}
              className="p-2 border rounded w-full"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Supplier ID:
            <input
              type="text"
              name="supplierId"
              value={medicine.supplierId || ""}
              className="p-2 border rounded w-full"
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md mt-4">
            Update Medicine
          </button>
        </form>
      ) : (
        <p>Select a medicine to update.</p>
      )}
    </div>
  );
};

export default UpdateMedicine;

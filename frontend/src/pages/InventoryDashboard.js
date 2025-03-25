import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Package, PlusCircle, ShoppingCart, Edit, Trash } from "lucide-react";
import BarChartComponent from "../components/BarChartComponent"; // Import BarChartComponent
import TopBoxes from "../components/TopBoxes"; // Import TopBoxes Component
import MedicineList from "../components/MedicineList";
import SearchMedicine from "../components/SearchMedicine"; // Import SearchMedicine Component
import ReportGenerator from "../components/ReportGenerator";


const Button = ({ children, className, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg shadow-md ${className}`}>
    {children}
  </button>
);

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]); // State for search
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/medicines");
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
        setFilteredMedicines(data); // Initialize filtered list
      } else {
        setMessage({ type: "error", text: "Failed to fetch medicines." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error fetching data." });
    }
  };

  // Handle Search Function
  const handleSearch = (filteredResults) => {
    setFilteredMedicines(filteredResults);
  };

  const handleChange = (e) => {
    setSelectedMedicine({ ...selectedMedicine, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/api/medicines/${selectedMedicine._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedMedicine),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Medicine updated successfully!" });
        fetchMedicines();
        setSelectedMedicine(null);
      } else {
        setMessage({ type: "error", text: "Failed to update medicine." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating medicine." });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/medicines/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setMessage({ type: "success", text: "Medicine deleted successfully!" });
          fetchMedicines();
        } else {
          setMessage({ type: "error", text: "Failed to delete medicine." });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Error deleting medicine." });
      }
    }
  };

  const handleEdit = (medicineId) => {
    navigate(`/update-medicine/${medicineId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Pharmacy Inventory Dashboard</h1>

      <TopBoxes medicines={medicines} />
      <BarChartComponent data={medicines} />

     

      {/* Buttons: Add Medicine & Generate Report */}
      <div className="flex justify-between items-center mt-6">
        <Button className="bg-blue-500 text-white" onClick={() => navigate("/add-item")}>
          <PlusCircle className="inline-block mr-2" size={18} /> Add New Medicine
        </Button>
        <ReportGenerator medicines={medicines} />
      </div>

      {/* Search Medicine */}
      <div className="mt-6">
        <SearchMedicine medicines={medicines} onSearch={handleSearch} />
      </div>

      {/* Medicine List Component with Search Results */}
      <MedicineList
        medicines={filteredMedicines} // Use filtered results
        onEdit={handleEdit}  // Pass the new handler instead of setSelectedMedicine
        handleDelete={handleDelete}
      />
    </div>
  );
}

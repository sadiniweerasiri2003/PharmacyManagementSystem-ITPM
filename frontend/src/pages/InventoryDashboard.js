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
    <div className="p-6 bg-[#f5fff2] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#0a3833]">Pharmacy Inventory Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#1B5E20]/20">
          <div className="flex items-center space-x-6">
            <div className="bg-[#1B5E20] p-4 rounded-lg">
              <Package className="text-white w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-600 mb-1">Total Items</p>
              <p className="text-3xl font-bold text-[#1B5E20]">{medicines.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#1B5E20]/20">
          <div className="flex items-center space-x-6">
            <div className="bg-[#1B5E20] p-4 rounded-lg">
              <AlertTriangle className="text-white w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-600 mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-[#1B5E20]">
                {medicines.filter((med) => med.quantity < 10).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#1B5E20]/20">
          <div className="flex items-center space-x-6">
            <div className="bg-[#1B5E20] p-4 rounded-lg">
              <ShoppingCart className="text-white w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-600 mb-1">Recent Orders</p>
              <p className="text-3xl font-bold text-[#1B5E20]">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-[#1B5E20]/20">
          <div className="flex items-center space-x-6">
            <div className="bg-[#1B5E20] p-4 rounded-lg">
              <PlusCircle className="text-white w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-600 mb-1">New Items</p>
              <p className="text-3xl font-bold text-[#1B5E20]">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Component */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#0a3833]">Stock Overview</h2>
        <BarChartComponent data={medicines} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <Button 
          className="bg-[#0a3833] text-white hover:bg-[#0a3833]/80 transition-all" 
          onClick={() => navigate("/add-item")}
        >
          <PlusCircle className="inline-block mr-2" size={18} /> Add New Medicine
        </Button>
        <ReportGenerator medicines={medicines} />
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <SearchMedicine 
          medicines={medicines} 
          onSearch={handleSearch}
          className="focus:ring-[#CCFF33] focus:border-[#CCFF33]"
        />
      </div>

      {/* Medicine List */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <MedicineList
          medicines={filteredMedicines}
          onEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

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
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

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
    setMedicineToDelete(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/medicines/${medicineToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeletePopup(false);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          fetchMedicines();
        }, 2000);
      } else {
        setMessage({ type: "error", text: "Failed to delete medicine." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error deleting medicine." });
    }
  };

  const handleEdit = (medicineId) => {
    navigate(`/update-medicine/${medicineId}`);
  };

  return (
    <div className="p-6 bg-[#f5fff2] min-h-screen relative">
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl transform transition-all animate-popup max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Medicine?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this medicine? This action cannot be undone.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl transform transition-all animate-popup">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B5E20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1B5E20] mb-2">Successfully Deleted!</h3>
              <p className="text-gray-600 mb-6">Medicine has been deleted successfully.</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div className="h-2 bg-[#1B5E20] rounded-full animate-progress"></div>
              </div>
            </div>
          </div>
        </div>
      )}

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

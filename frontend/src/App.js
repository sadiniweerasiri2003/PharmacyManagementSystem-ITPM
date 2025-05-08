import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryDashboard from "./pages/InventoryDashboard";
import AddMedicines from "./pages/AddMedicines";
import UpdateMedicine from "./pages/UpdateMedicine";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";

// Component imports corrected to use default exports
import SupplierOrder from "./components/SupplierOrder";
import SupplierOrderList from "./components/SupplierOrderList";
import PreviousSupplierOrder from "./components/PreviousSupplierOrders";
import EditSupplierOrder from "./components/EditSupplierOrder";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5fff2]"> {/* Updated background color */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cashier-dashboard" element={<CashierDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
          <Route path="/add-item" element={<AddMedicines />} />
          <Route path="/update-medicine/:id" element={<UpdateMedicine />} />
          
          {/* Supplier Order Routes */}
          <Route path="/orders" element={<SupplierOrderList />} />
          <Route path="/orders/add" element={<SupplierOrder fetchOrders={() => {}} />} />
          <Route path="/orders/edit/:id" element={<EditSupplierOrder />} />
          <Route path="/previous-supplier-orders" element={<PreviousSupplierOrder />} />
          <Route path="/edit-supplier/:id" element={<EditSupplierOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

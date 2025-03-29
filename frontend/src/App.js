import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SupplierOrder from "./components/SupplierOrder";  // New form for creating and editing orders
import SupplierOrderList from "./components/SupplierOrderList"; // New list for viewing orders
import PreviousSupplierOrders from "./components/PreviousSupplierOrders";
import EditSupplierOrder from "./components/EditSupplierOrder";  // For handling order edits directly
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierManagement from "./components/SupplierManagement";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cashier-dashboard" element={<CashierDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier" element={<SupplierManagement />} />
          
          
          {/* Routes for Supplier Orders */}
          <Route path="/orders" element={<SupplierOrderList />} /> {/* View all orders */}
          <Route path="/orders/add" element={<SupplierOrder fetchOrders={() => {}} />} /> {/* Add a new order */}
          <Route path="/orders/edit/:id" element={<EditSupplierOrder fetchOrders={() => {}} />} /> {/* Edit an existing order */}
        
          
          {/* Other routes */}
          <Route path="/previous-supplier-orders" element={<PreviousSupplierOrders />} />
          <Route path="/edit-supplier/:id" element={<EditSupplierOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

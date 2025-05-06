import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryDashboard from "./pages/InventoryDashboard";
import AddMedicines from "./pages/AddMedicines";
import UpdateMedicine from "./pages/UpdateMedicine";
import Login from "./pages/login";
import SupplierOrder from "./components/SupplierOrder";
import SupplierOrderList from "./components/SupplierOrderList";
import PreviousSupplierOrders from "./components/PreviousSupplierOrders";
import EditSupplierOrder from "./components/EditSupplierOrder";
import AdminDashboard from "./pages/Dashboard"; // Changed this import
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";


function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes with DashboardLayout */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          } />
          <Route path="/inventory-dashboard" element={
            <DashboardLayout>
              <InventoryDashboard />
            </DashboardLayout>
          } />
          <Route path="/add-item" element={
            <DashboardLayout>
              <AddMedicines />
            </DashboardLayout>
          } />
          <Route path="/update-medicine/:id" element={
            <DashboardLayout>
              <UpdateMedicine />
            </DashboardLayout>
          } />

          {/* Supplier Routes with DashboardLayout */}
          <Route path="/supplier-dashboard" element={
            <DashboardLayout>
              <SupplierDashboard />
            </DashboardLayout>
          } />
          <Route path="/orders" element={
            <DashboardLayout>
              <SupplierOrderList />
            </DashboardLayout>
          } />
          <Route path="/orders/add" element={
            <DashboardLayout>
              <SupplierOrder fetchOrders={() => {}} />
            </DashboardLayout>
          } />
          <Route path="/orders/edit/:id" element={
            <DashboardLayout>
              <EditSupplierOrder fetchOrders={() => {}} />
            </DashboardLayout>
          } />
          <Route path="/previous-supplier-orders" element={
            <DashboardLayout>
              <PreviousSupplierOrders />
            </DashboardLayout>
          } />
          <Route path="/edit-supplier/:id" element={
            <DashboardLayout>
              <EditSupplierOrder />
            </DashboardLayout>
          } />

          {/* Cashier Routes with DashboardLayout */}
          <Route path="/cashier-dashboard" element={
            <DashboardLayout>
              <CashierDashboard />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

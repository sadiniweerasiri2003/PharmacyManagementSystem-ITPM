import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/login/dashboard" 
            element={
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/cashier-dashboard" 
            element={
              <DashboardLayout>
                <CashierDashboard />
              </DashboardLayout>
            } 
          />
          <Route 
            path="/supplier-dashboard" 
            element={
              <DashboardLayout>
                <SupplierDashboard />
              </DashboardLayout>
            } 
          />
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;

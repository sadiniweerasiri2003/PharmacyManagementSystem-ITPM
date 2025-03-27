import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import SalesDashboard from "./components/SalesDashboard";
import BillingForm from "./components/BillingForm";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<SalesDashboard />} /> {/* Add Dashboard Route ✅ */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/cashier-dashboard" element={<CashierDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/billing" element={<BillingForm />} /> {/* Add Billing Route ✅ */}
      </Routes>
    </Router>
  );
}

export default App;


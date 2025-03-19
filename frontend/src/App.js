import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RoleSelection from "./components/RoleSelection";
import InventoryDashboard from "./pages/InventoryDashboard";
import AddMedicines from "./pages/AddMedicines";
import UpdateMedicine from "./pages/UpdateMedicine";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/dashboard" element={<InventoryDashboard />} />
        <Route path="/add-item" element={<AddMedicines/>} />
        <Route path="/update-medicine" element={<UpdateMedicine />} />
      </Routes>
    </Router>
  );
}

export default App;

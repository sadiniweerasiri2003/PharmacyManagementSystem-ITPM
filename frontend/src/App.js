import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PredictionsTable from "./components/PredictionsTable";
import RestockAlert from "./components/RestockAlert";
import AllRestockAlerts from "./pages/AllRestockAlerts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PredictionsTable />} />
        <Route path="/alerts" element={<RestockAlert />} />
        <Route path="/all-alerts" element={<AllRestockAlerts />} />
        <Route path="/reorder/:medicineId" element={<div>Reorder Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;

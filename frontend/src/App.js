import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PredictionsTable from "./components/PredictionsTable";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main route directly shows predictions table */}
        <Route path="/" element={<PredictionsTable />} />
      </Routes>
    </Router>
  );
}

export default App;

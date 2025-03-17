import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import RoleSelection from "./components/RoleSelection";
import Login from "./components/login";

function App() {
  return (
    <Router>  {/* Wrap the application in BrowserRouter */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <RoleSelection />
      </div>
    </Router>
  );
}

export default App;

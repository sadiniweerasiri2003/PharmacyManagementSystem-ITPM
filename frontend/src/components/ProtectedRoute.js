import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token"); // Check if the user is logged in
  const userRole = localStorage.getItem("role"); // Get user role

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check if the token is expired (you can handle this based on the token expiry time)
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token to check expiration
    const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp

    if (decoded.exp < currentTime) {
      // Token is expired
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // If there is an issue decoding or verifying the token, redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If user role is not in allowedRoles, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render the requested page if conditions are met
};

export default ProtectedRoute;

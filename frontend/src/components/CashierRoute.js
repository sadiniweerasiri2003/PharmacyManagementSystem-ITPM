import { Navigate } from 'react-router-dom';

const CashierRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || userRole !== 'cashier') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default CashierRoute;

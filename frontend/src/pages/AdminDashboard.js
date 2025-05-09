import React from 'react';
import RestockAlert from '../components/RestockAlert';
import Dashboard from './Dashboard';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Keep the metrics row from Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* ...existing metrics... */}
      </div>

      {/* Replace Sales Analytics with RestockAlert */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <RestockAlert limit={5} />
      </div>

      {/* Keep the Latest Orders and Top Selling sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ...existing order sections... */}
      </div>
    </div>
  );
};

export default AdminDashboard;

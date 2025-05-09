import React, { useState, useEffect } from 'react';
import { getTopSellingMedicines } from '../../services/salesService';

const TopSellingChart = () => {
  const [topMedicines, setTopMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopMedicines = async () => {
      try {
        const response = await getTopSellingMedicines();
        setTopMedicines(response.data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch top selling medicines');
        setLoading(false);
      }
    };

    fetchTopMedicines();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchTopMedicines, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[300px]">
      <div className="text-gray-500">Loading data...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-[300px]">
      <div className="text-red-500">{error}</div>
    </div>
  );

  // Get the maximum quantity to scale the bars
  const maxQuantity = Math.max(...topMedicines.map(med => med.totalQuantity));

  return (
    <div className="relative h-[300px] flex flex-col justify-end">
      {/* Chart Container */}
      <div className="flex justify-around items-end w-full mt-6">
        {topMedicines.map((medicine, index) => (
          <div key={index} className="flex flex-col items-center w-32">
            {/* Bar */}
            <div
              className={`w-20 ${
                index === 0
                  ? 'bg-[#1B5E20]'
                  : index === 1
                  ? 'bg-[#1B5E20]/80'
                  : 'bg-[#1B5E20]/60'
              } rounded-t-lg flex items-end justify-center relative group transition-all duration-300 hover:opacity-90`}
              style={{ height: `${(medicine.totalQuantity / maxQuantity) * 200}px` }}
            >
              {/* Tooltip */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48 text-center">
                <p className="font-semibold text-xs text-[#1B5E20]">{medicine.name}</p>
                <p className="text-xs text-gray-600">Sold: {medicine.totalQuantity} units</p>
                <p className="text-xs text-gray-600">Revenue: ${medicine.totalRevenue.toFixed(2)}</p>
              </div>
              
              <div className="h-10 w-10 bg-[#CCFF33] rounded-full flex items-center justify-center shadow-sm -mb-5">
                <span className="text-lg">💊</span>
              </div>
            </div>
            {/* Label */}
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-[#0a3833] truncate w-24" title={medicine.name}>
                {medicine.name}
              </p>
              <p className="text-xs text-gray-500">{medicine.totalQuantity} units</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingChart;

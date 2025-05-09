import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestockAlert = ({ limit = 5 }) => {
    const [urgentRestocks, setUrgentRestocks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPredictionsAndMedicines = async () => {
            try {
                // Fetch predictions
                const predResponse = await axios.get('http://localhost:5001/api/predictions');
                // Fetch medicines for names
                const medResponse = await axios.get('http://localhost:5001/api/medicines');
                
                // Create a map of medicine details
                const medicineMap = medResponse.data.reduce((acc, med) => {
                    acc[med.medicineId] = med.name;
                    return acc;
                }, {});

                // Combine predictions with medicine names
                const urgentItems = predResponse.data
                    .filter(pred => pred.days_until_restock <= 7)
                    .map(pred => ({
                        ...pred,
                        medicine_name: medicineMap[pred.medicine_id] || 'Unknown Medicine'
                    }))
                    .sort((a, b) => a.days_until_restock - b.days_until_restock);

                setUrgentRestocks(urgentItems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPredictionsAndMedicines();
        const interval = setInterval(fetchPredictionsAndMedicines, 300000);
        return () => clearInterval(interval);
    }, []);

    if (urgentRestocks.length === 0) return null;

    const displayedItems = limit ? urgentRestocks.slice(0, limit) : urgentRestocks;

    return (
        <div className="w-full"> {/* Changed from max-w-2xl mx-auto px-2 py-4 */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-[#0a3833] p-3">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-[#CCFF33] rounded-full text-sm">🔮</span>
                            <h3 className="text-base font-bold text-white">Predictive Stock Alert</h3>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {displayedItems.map((item, index) => (
                        <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold text-[#0a3833] text-sm mb-1">
                                        {item.medicine_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Medicine ID: {item.medicine_id}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Current Stock: {item.current_stock}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={() => navigate(`/reorder/${item.medicine_id}`)}
                                        className={`mt-1 block px-3 py-1 rounded text-xs transition-all duration-300 ${
                                            item.days_until_restock === 0 
                                            ? 'bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg hover:shadow-xl scale-105 hover:scale-110 animate-pulse'
                                            : 'bg-[#0a3833] hover:bg-[#0a3833]/80 text-white'
                                        }`}
                                    >
                                        {item.days_until_restock === 0 ? 'REORDER NOW!' : 'Reorder'}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className={`text-xs ${
                                        item.days_until_restock === 0 
                                        ? 'text-red-600 font-bold'
                                        : 'text-[#0a3833]'
                                    }`}>
                                        {item.days_until_restock} days left until restock needed
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                        item.days_until_restock === 0 
                                        ? 'bg-red-200 text-red-900' 
                                        : item.days_until_restock <= 2
                                        ? 'bg-[#CCFF33] text-[#0a3833]'
                                        : 'bg-[#CCFF33]/50 text-[#0a3833]'
                                    }`}>
                                        {item.days_until_restock}d
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div
                                        className={`${
                                            item.days_until_restock === 0 
                                            ? 'bg-red-600 animate-pulse' 
                                            : 'bg-[#0a3833]'
                                        } h-1 rounded-full`}
                                        style={{ width: `${(item.days_until_restock / 7) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestockAlert;

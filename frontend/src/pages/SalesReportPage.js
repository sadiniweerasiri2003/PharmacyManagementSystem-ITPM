import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [annualData, setAnnualData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [medicineStats, setMedicineStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (!userRole || (userRole !== 'admin' && userRole !== 'cashier')) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchSalesData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/sales?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      // Fetch annual sales data
      const annualResponse = await fetch('http://localhost:5001/api/sales/annual');
      const annualData = await annualResponse.json();
      setAnnualData(annualData);

      // Fetch monthly sales data
      const monthlyResponse = await fetch('http://localhost:5001/api/sales/monthly');
      const monthlyData = await monthlyResponse.json();
      setMonthlyData(monthlyData);

      // Fetch daily sales data
      const dailyResponse = await fetch('http://localhost:5001/api/sales/daily');
      const dailyData = await dailyResponse.json();
      setDailyData(dailyData);

      // Fetch medicine statistics
      const medicineResponse = await fetch('http://localhost:5001/api/sales/medicine-stats');
      const medicineData = await medicineResponse.json();
      setMedicineStats(medicineData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text('Sales Report', 14, 15);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 25);

    const tableColumn = [
      'Invoice ID',
      'Medicine',
      'Quantity',
      'Unit Price',
      'Total',
      'Date'
    ];

    const tableRows = salesData.flatMap(sale =>
      sale.medicines.map(medicine => [
        sale.invoiceId,
        medicine.name,
        medicine.qty_sold,
        medicine.unitprice,
        medicine.totalprice,
        new Date(sale.orderdate_time).toLocaleDateString()
      ])
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [10, 56, 51] }
    });

    doc.save('sales-report.pdf');
  };

  // Chart configurations
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  const annualChartData = {
    labels: annualData.map(d => d.year),
    datasets: [{
      label: 'Annual Sales',
      data: annualData.map(d => d.total),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const monthlyChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [{
      label: 'Monthly Sales',
      data: monthlyData.map(d => d.total),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }]
  };

  const dailyChartData = {
    labels: dailyData.map(d => d.date),
    datasets: [{
      label: 'Daily Sales',
      data: dailyData.map(d => d.total),
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
    }]
  };

  const pieChartData = {
    labels: medicineStats.map(m => m.name),
    datasets: [{
      data: medicineStats.map(m => m.quantity),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
    }]
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Report Generation</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-end space-x-4">
            <button
              onClick={fetchSalesData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Fetch Data
            </button>
            <button
              onClick={generatePDF}
              disabled={!salesData.length}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>

      {salesData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.flatMap(sale =>
                sale.medicines.map((medicine, idx) => (
                  <tr key={`${sale.invoiceId}-${idx}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.invoiceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{medicine.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{medicine.qty_sold}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${medicine.unitprice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${medicine.totalprice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sale.orderdate_time).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Annual Sales</h3>
          <Bar options={barOptions} data={annualChartData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
          <Bar options={barOptions} data={monthlyChartData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Daily Sales</h3>
          <Bar options={barOptions} data={dailyChartData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Medicine Sales Distribution</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default SalesReportPage;

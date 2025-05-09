const Sales = require('../models/Sales');

exports.getAnnualSales = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        
        // Create dates in UTC
        const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

        console.log('Query parameters:', {
            year,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });

        // First, let's check if we have any sales in this date range
        const salesCheck = await Sales.findOne({
            orderdate_time: {
                $gte: startDate,
                $lte: endDate
            }
        });

        console.log('Sales check result:', salesCheck);

        // Get monthly sales data
        const monthlySales = await Sales.aggregate([
            {
                $match: {
                    orderdate_time: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            { $unwind: "$medicines" },
            {
                $group: {
                    _id: { $month: "$orderdate_time" },
                    totalSales: { $sum: { $multiply: ["$medicines.qty_sold", "$medicines.unitprice"] } }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        console.log('Monthly sales aggregation result:', monthlySales);

        // Calculate total annual sales
        const totalAnnualSales = monthlySales.reduce((acc, month) => acc + month.totalSales, 0);

        // Format the response with percentages
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const formattedData = monthNames.map((month, index) => {
            const monthData = monthlySales.find(m => m._id === index + 1);
            const sales = monthData ? monthData.totalSales : 0;
            const percentage = totalAnnualSales > 0 
                ? ((sales / totalAnnualSales) * 100).toFixed(2) 
                : 0;

            return {
                month,
                sales,
                percentage: parseFloat(percentage)
            };
        });

        const response = {
            year,
            totalAnnualSales,
            monthlySales: formattedData,
            hasSales: totalAnnualSales > 0
        };

        console.log('Sending response:', response);
        res.json(response);
    } catch (error) {
        console.error('Error fetching annual sales:', error);
        res.status(500).json({ error: 'Failed to fetch annual sales data' });
    }
};

exports.getMedicineSalesDistribution = async (req, res) => {
    try {
        const medicineSales = await Sales.aggregate([
            { $unwind: "$medicines" },
            {
                $group: {
                    _id: "$medicines.name",
                    totalQuantity: { $sum: "$medicines.qty_sold" },
                    totalRevenue: { $sum: { $multiply: ["$medicines.qty_sold", "$medicines.unitprice"] } }
                }
            },
            { $sort: { totalQuantity: -1 } }
        ]);

        console.log('Medicine distribution aggregation result:', medicineSales);

        const totalSales = medicineSales.reduce((acc, med) => acc + med.totalQuantity, 0);
        
        const formattedData = medicineSales.map(medicine => ({
            name: medicine._id,
            quantity: medicine.totalQuantity,
            revenue: medicine.totalRevenue,
            percentage: ((medicine.totalQuantity / totalSales) * 100).toFixed(2)
        }));

        console.log('Sending medicine distribution:', formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching medicine distribution:', error);
        res.status(500).json({ error: 'Failed to fetch medicine sales distribution' });
    }
};

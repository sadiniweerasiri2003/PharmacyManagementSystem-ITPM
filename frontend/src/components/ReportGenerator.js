import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Import autoTable plugin

const ReportGenerator = ({ medicines }) => {
  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Title
    doc.text("Pharmacy Inventory Report", 14, 15);

    // Define table columns (ALL fields included)
    const tableColumn = [
      "ID",
      "Name",
      "Batch Number",
      "Expiry Date",
      "Quantity",
      "Price",
      "Supplier ID",
      "Last Restocked Date",
      "Created At",
      "Updated At"
    ];

    // Prepare table rows with all fields
    const tableRows = medicines.map((medicine) => [
      medicine._id,
      medicine.name,
      medicine.batchNumber,
      medicine.expiryDate || "N/A",
      medicine.quantity,
      `$${medicine.price}`,
      medicine.supplierId || "N/A",
      medicine.lastRestockedDate || "N/A",
      medicine.createdAt ? new Date(medicine.createdAt).toLocaleDateString() : "N/A",
      medicine.updatedAt ? new Date(medicine.updatedAt).toLocaleDateString() : "N/A"
    ]);

    // Register autoTable and generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [44, 62, 80] }, // Dark header color
    });

    // Save the generated PDF
    doc.save("Pharmacy_Inventory_Report.pdf");
  };

  return (
    <div className="mt-6">
      <button
        onClick={generatePDF}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
      >
        Generate Full Report
      </button>
    </div>
  );
};

export default ReportGenerator;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SupplierList = () => {
  const navigate = useNavigate();
  // ... (keep existing state and effects)

  const handleAddSupplier = () => {
    navigate("/suppliers/add");
  };

  const handleEditSupplier = (supplierId) => {
    navigate(`/suppliers/edit/${supplierId}`);
  };

  // ... (keep rest of component)
};

export default SupplierList;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/suppliers/${id}`);
        setFormData(response.data);
      } catch (err) {
        console.error("Failed to fetch supplier:", err);
      }
    };

    fetchSupplier();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/suppliers/${id}`, formData);
      navigate("/suppliers");
    } catch (err) {
      console.error("Error updating supplier:", err);
    }
  };

  const handleCancel = () => {
    navigate("/suppliers");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required
        />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  );
};

export default EditSupplier;

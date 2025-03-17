import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for routing

const Login = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      alert("Login Successful!");
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">{role} Login</h2>

        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {/* Display Register Now link only for Supplier role */}
        {role === "supplier" && (
          <div className="mt-4 text-center">
            <p>
              New to our system?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

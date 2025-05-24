import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [stockPrices, setStockPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          "http://20.244.56.144/evaluation-service/companies"
        );
        setCompanies(response.data);
      } catch (err) {
        setError("Failed to load companies. Please try again later.");
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch stock prices when a company is selected
  useEffect(() => {
    const fetchStockPrices = async () => {
      if (!selectedStock) return;

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://20.244.56.144/evaluation-service/stocks/${selectedStock}`,
          {
            params: { minutes: 50 },
            // headers: { Authorization: `Bearer ${token}` } // Uncomment if needed
          }
        );
        setStockPrices(response.data);
      } catch (err) {
        setError("Failed to load stock prices. Please try again.");
        console.error("Error fetching stock prices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockPrices();
  }, [selectedStock]);

  return (
    <div className="app">
      <h1>📈 Stock Tracker</h1>

      <select
        className="dropdown"
        onChange={(e) => setSelectedStock(e.target.value)}
        value={selectedStock}
        disabled={loading}
      >
        <option value="">Select a Company</option>
        {companies.map((company) => (
          <option key={company.symbol} value={company.symbol}>
            {company.name} ({company.symbol})
          </option>
        ))}
      </select>

      {error && <div className="error-message">⚠ {error}</div>}

      {loading ? (
        <div className="loading">⏳ Loading stock prices...</div>
      ) : (
        <ul className="stock-list">
          {stockPrices.map((price, index) => (
            <li key={`${price.time}-${index}`}>
              <span>💰 Price:</span> ${price.price?.toFixed(2)} |{" "}
              <span>🕒 Time:</span> {new Date(price.time).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
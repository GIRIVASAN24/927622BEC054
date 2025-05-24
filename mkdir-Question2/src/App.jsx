import React, { useState } from "react";

function AverageCalculator() {
  const [numbers, setNumbers] = useState("");
  const [average, setAverage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNumbers(e.target.value);
  };

  const calculateAverage = async () => {
    setError(null);
    setAverage(null);

    // Convert input string to array of numbers
    const numsArray = numbers
      .split(",")
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    if (numsArray.length === 0) {
      setError("Please enter valid numbers separated by commas.");
      return;
    }

    try {
      // Replace 'YOUR_API_URL' with the actual microservice URL
      const response = await fetch("YOUR_API_URL", {
        method: "POST", // or GET depending on API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numbers: numsArray }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();
      setAverage(data.average); // assuming API responds with { average: ... }
    } catch (err) {
      setError("Failed to fetch average from server.");
    }
  };

  return (
    <div>
      <h2>Average Calculator</h2>
      <input
        type="text"
        value={numbers}
        onChange={handleChange}
        placeholder="Enter numbers separated by commas"
      />
      <button onClick={calculateAverage}>Calculate Average</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {average !== null && <p>Average: {average}</p>}
    </div>
  );
}

export default AverageCalculator;

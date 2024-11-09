import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const RelevanceLikelihood = () => {
  const [option, setOption] = useState('sector');
  const [inputValue, setInputValue] = useState('Energy');
  const [result, setResult] = useState([]);

  useEffect(() => {
    fetchRelevanceLikelihood();
  }, [option, inputValue]);

  const fetchRelevanceLikelihood = async () => {
    try {
      const response = await axios.post('http://localhost:4500/relevance_likelihood', {
        option,
        inputValue
      });

      const relevanceData = response.data.relevance;
      const likelihoodData = response.data.likelihood;

      const relevanceMap = new Map(relevanceData.map(item => [item.relevance, item.count]));
      const likelihoodMap = new Map(likelihoodData.map(item => [item.likelihood, item.count]));

      const allKeys = new Set([...relevanceMap.keys(), ...likelihoodMap.keys()]);

      const formattedData = Array.from(allKeys).map(key => ({
        name: `relevance_likelihood_${key}`,
        relevance_count: relevanceMap.get(key) || 0,
        likelihood_count: likelihoodMap.get(key) || 0
      }));

      setResult(formattedData);
    } catch (error) {
      console.error('Error fetching relevance and likelihood data:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRelevanceLikelihood();
  };

  return (
    <div className="relevance-likelihood-container">
      <h2>Relevance and Likelihood Analysis</h2>
      <form onSubmit={handleSubmit} style={{color:'teal',  fontWeight: 'bold'}}>
        <div style={{ display: 'flex', gap: '30px' }}>
          <div>
            <label>
              Select Option:
              <select value={option} onChange={(e) => setOption(e.target.value)}>
                <option value="sector">Sector</option>
                <option value="topic">Topic</option>
                <option value="source">Source</option>
                <option value="end_year">End-year</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Input Value:
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
            </label>
          </div>
          <div style={{ border: '2px solid blue', backgroundColor: 'lightblue', color: 'blue', padding: '5px' }}>
            Selected {option}: {inputValue}
          </div>
        </div>
        <br />
      </form>
      <br />
      <ResponsiveContainer width="100%" height={400}>
        {result.length > 0 ? (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} />
            <Radar name="Relevance" dataKey="relevance_count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Likelihood" dataKey="likelihood_count" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        ) : (
          <p>No data available</p>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default RelevanceLikelihood;

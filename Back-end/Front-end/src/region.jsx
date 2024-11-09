import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Topic = () => {
  const [topic, setTopic] = useState('Northern America');
  const [options, setOptions] = useState('topic');
  const [chartData, setChartData] = useState([]);

  const COLORS = [
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980', '#1AFF33', '#999933', '#FF3380',
    '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF', '#4D4DFF',
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${window.location.origin}/region`, { topic, options });
        setChartData(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [options]); 
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="region-container">
        <p style={{color:'#ff33ff',fontSize:'20px',fontWeight:'bold'}}>Region Wise analysis</p>
      <div className="region-form">
        <label className="region-label">
          Region:
          <input type="text" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="region-input" />
        </label>
        <label className="region-label">
          Options:
          <select name="options" value={options} onChange={(e) => setOptions(e.target.value)} className="region-select">
            <option value="sector">Sector</option>
            <option value="endyear">End Year</option>
            <option value="pest">Pest</option>
            <option value="source">Source</option>
            <option value="topic">Topic</option>
          </select>
        </label>
      </div>
      <div style={{ padding: '5px', backgroundColor: 'mistyrose', color: '#ff33ff', border: '2px solid #ff33ff', height: '20px' }}>Region {topic} : {options}</div>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie 
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Topic;

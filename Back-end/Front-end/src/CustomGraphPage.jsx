import React, { useState } from 'react';
import { LineChart, BarChart, PieChart, AreaChart, Line, Bar, Pie, Area, XAxis, YAxis, Tooltip, Legend, LabelList, Cell } from 'recharts';
import html2canvas from 'html2canvas';

const CustomGraphPage = () => {
  const [data, setData] = useState([]);
  const [graphType, setGraphType] = useState('Line');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result);
        setData(jsonData);
      } catch (error) {
        alert("Invalid JSON file");
      }
    };
    if (file) {
      reader.readAsText(file);
    }
  };

  const handleGraphTypeChange = (e) => {
    setGraphType(e.target.value);
  };

  const handleDownload = () => {
    const graphElement = document.getElementById('graph');
    html2canvas(graphElement).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'graph.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    });
  };

  const renderGraph = () => {
    switch (graphType) {
      case 'Bar':
        return (
          <BarChart width={600} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        );
      case 'Pie':
        return (
          <PieChart width={600} height={300}>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'Area':
        return (
          <AreaChart width={600} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8">
              <LabelList dataKey="value" position="top" />
            </Area>
          </AreaChart>
        );
      case 'Line':
      default:
        return (
          <LineChart width={600} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8">
              <LabelList dataKey="value" position="top" />
            </Line>
          </LineChart>
        );
    }
  };

  return (
    <div className="graph-container">
      <h2>Custom Graph</h2>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <select onChange={handleGraphTypeChange}>
        <option value="Line">Line</option>
        <option value="Bar">Bar</option>
        <option value="Pie">Pie</option>
        <option value="Area">Area</option>
      </select>
      <div id="graph" className="graph">
        {renderGraph()}
      </div>
      <button className="download-btn" onClick={handleDownload}>Download as JPG</button>
    </div>
  );
};

export default CustomGraphPage;

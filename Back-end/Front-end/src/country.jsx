import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from 'recharts';

const Country = () => {
    const [country, setCountry] = useState('United States of America');
    const [regionData, setRegionData] = useState([]);
    const [sectorData, setSectorData] = useState([]);
    const [topicData, setTopicData] = useState([]);
    const [pestData, setPestData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
  
    const fetchCountryData = async () => {
      try {
        const response = await axios.post(`${window.location.origin}/country`, { country });
        setRegionData(response.data.region);
        setSectorData(response.data.sector);
        setTopicData(response.data.topic);
        setPestData(response.data.pest); 
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };
  
    useEffect(() => {
      fetchCountryData();
    }, [country]);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{ fontSize: '10px' }}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{ fontSize: '10px' }}>{`PV ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" style={{ fontSize: '8px' }}>
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className='country-div'>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ marginRight: '10px',color:'teal',fontWeight:'bold' }}>Country:</div>
    <label>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ border: '2px solid black', borderRadius: '5px', width: '200px', height: '30px' }}
      />
    </label>
  </div>
      <div className='country-chart-whole'>
        <div className='country-chart-box'>
          <h2 style={{color:'red'}}>Region</h2>
          <div className='country-chart'>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="red"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='country-chart-box'>
          <h2 style={{color:'blue'}}>Sector</h2>
          <div className='country-chart'>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="blue"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className='topicpest-country'>
        <div className='country-chart-box'>
          <h2 style={{color:'green'}}>Topic</h2>
          <div className='country-chart'>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="green"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='country-chart-box'>
          <h2 style={{color:'yellow'}}>PEST</h2>
          <div className='country-chart'>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pestData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="yellow"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Country;

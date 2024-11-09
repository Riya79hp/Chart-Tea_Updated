import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';


const StartEndYear = () => {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const fetchData = () => {
      axios.post('http://localhost:4500/start_end_year', { filterType, filterValue })
        .then(response => {
          const { start_year, end_year } = response.data;

          const yearMap = new Map();

          start_year.forEach(item => {
            yearMap.set(item.sy, { startyear_count: item.count, endyear_count: 0 });
          });

          end_year.forEach(item => {
            if (yearMap.has(item.ey)) {
              yearMap.get(item.ey).endyear_count = item.count;
            } else {
              yearMap.set(item.ey, { startyear_count: 0, endyear_count: item.count });
            }
          });

          const formattedData = Array.from(yearMap.entries()).map(([year, counts]) => ({
            name: `${year}`,
            ...counts,
          }));

          setData(formattedData);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };

    fetchData();
  }, [filterType, filterValue]);

  return (
    <div className="start_end-container">
        <p style={{fontSize:'25px',color:' rgb(204, 0, 102)'}}><b>End and Start Year analysis</b></p>
      <div className="start_end-filter-container">
      <label style={{color:'teal'}}>Select option</label>
        <select className="start_end-filter-dropdown" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Select Filter Type</option>
          <option value="sector">Sector</option>
          <option value="topic">Topic</option>
          <option value="region">Region</option>
          <option value="country">Country</option>
          <option value="pestle">PEST</option>
          <option value="source">Source</option>
        </select>
        <label style={{color:'teal'}}>Input value</label>
        <input
          className="start_end-filter-input"
          type="text"
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
          placeholder="Enter filter value"
        />
        <div style={{border:'2px solid  rgb(204, 0, 102)',padding:'5px',backgroundColor:'mistyrose',color:'rgb(204, 0, 102)'}}>{filterValue==='' ? "Showing data over years" :  `Selected ${filterType} :  ${filterValue}`}</div>
      </div>
      <div className="start_end-chart-container">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            barCategoryGap="0"
            barGap={0}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis 
              dataKey="name" 
              scale="band" 
              tick={{ fontSize: 10 }}
              interval={0} 
              angle={-45} 
              textAnchor="end"
              padding={{ left: 10, right: 10 }} 
              gap="2px"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 700]}
            />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="startyear_count" fill="green" stroke="green" />
            <Bar dataKey="endyear_count" barSize={15} fill="brown" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StartEndYear;

// IntensityOverall.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const IntensityOverall = () => {
  const [intensityData, setIntensityData] = useState([]);

  const fetchIntensityData = async () => {
    try {
      const response = await axios.post(`${window.location.origin}/intensityoverall`);
      const categorizedData = categorizeIntensityData(response.data);
      setIntensityData(categorizedData);
    } catch (error) {
      console.error('Error fetching intensity data:', error);
    }
  };

  const categorizeIntensityData = (data) => {
    const categories = {
      '18-24': { name: '18-24', count: 0, fill: '#8884d8' },
      '25-29': { name: '25-29', count: 0, fill: '#83a6ed' },
      '30-34': { name: '30-34', count: 0, fill: '#8dd1e1' },
      '35-39': { name: '35-39', count: 0, fill: '#82ca9d' },
      '40-49': { name: '40-49', count: 0, fill: '#a4de6c' },
      '50-70': { name: '50-70', count: 0, fill: '#d0ed57' },
      '70+': { name: '70+', count: 0, fill: '#ffc658' },
      'Unknown': { name: 'Unknown', count: 0, fill: '#ff8042' },
    };

    data.forEach(item => {
      if (item.intensity >= 18 && item.intensity <= 24) {
        categories['18-24'].count += item.count;
      } else if (item.intensity >= 25 && item.intensity <= 29) {
        categories['25-29'].count += item.count;
      } else if (item.intensity >= 30 && item.intensity <= 34) {
        categories['30-34'].count += item.count;
      } else if (item.intensity >= 35 && item.intensity <= 39) {
        categories['35-39'].count += item.count;
      } else if (item.intensity >= 40 && item.intensity <= 49) {
        categories['40-49'].count += item.count;
      } else if (item.intensity >= 50 && item.intensity <= 70) {
        categories['50-70'].count += item.count;
      } else if (item.intensity > 70) {
        categories['70+'].count += item.count;
      }
    });

    return Object.values(categories);
  };

  useEffect(() => {
    fetchIntensityData();
  }, []);

  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };

  return (
    <div className="intensity-overall-container">
      <h2 className="intensity-heading">Intensity Data from Start Year 2015 to 2023</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="10%"
          outerRadius="80%"
          barSize={10}
          data={intensityData}
        >
          <RadialBar
            minAngle={15}
            label={{ position: 'insideStart', fill: 'black' }}
            background
            clockWise
            dataKey="count"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={style}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IntensityOverall;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalCountry = () => {
  const [countryName, setCountryName] = useState('United States of America');
  const [total, setTotal] = useState(null);

  const fetchTotalCount = async (country) => {
    try {
      const response = await axios.post(`http://localhost:4500/totalcountry/${country}`);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  useEffect(() => {
    fetchTotalCount(countryName);
  }, []);
  const handleInputChange = async (e) => {
    const name = e.target.value;
    setCountryName(name);
    fetchTotalCount(name);
  };

  return (
    <div className='totalcountry'>
      <p style={{ color: 'green', fontSize: '20px', textAlign: 'center', marginBottom: '10px' }}>Total Count by Country</p>
      <div>
        <label style={{color:'teal'}}><b>
          Enter Country Name:</b>
          <input
            type="text"
            value={countryName}
            onChange={handleInputChange}
            required
            style={{ borderRadius: '5px', width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </label>
      </div>
      <div>
        {total !== null && (
          <p style={{ fontSize: '80px', textAlign: 'center', marginTop: '20px' ,color:'red'}}>{total}</p>
        )}
      </div>
    </div>
  );
};

export default TotalCountry;

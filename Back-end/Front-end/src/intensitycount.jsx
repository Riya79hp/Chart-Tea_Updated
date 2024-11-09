import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IntensityCount = () => {
    const [selectedOption, setSelectedOption] = useState('endYear');
    const [inputValue, setInputValue] = useState('2016');
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${window.location.origin}/intensity/${selectedOption}`, {
                inputValue
            });
            setData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedOption, inputValue]);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        setInputValue(''); 
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="intensity-count-container">
            <p style={{color:'#8884d8',fontSize:'20px'}}>Intensity</p>
            <form onSubmit={handleFormSubmit} className='form-intensity'>
                
                <label className="form-label">
                    Select Option:
                    <select value={selectedOption} onChange={handleOptionChange} className="form-input">
                        <option value="endYear">End year</option>
                        <option value="sector">Sector</option>
                        <option value="region">Region</option>
                        <option value="topic">Topic</option>
                        <option value="country">Country</option>
                        <option value="pest">PEST</option> 
                    </select>
                </label>
                {selectedOption && (
                    
                    <label className="form-label">
                        Input Value:
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                    </label>
                
                )}
                 </form>
            <div className="chart-container">
                <ResponsiveContainer width="90%" height={300}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="intensity" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
           
                <div className="side-box">
                    <p>Selected {selectedOption === 'endYear' ? 'End Year' : selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}: {inputValue}</p>
                </div>
        </div>
        
    );
};

export default IntensityCount;

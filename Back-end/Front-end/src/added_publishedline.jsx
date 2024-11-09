import { useState, useEffect } from 'react';
import axios from 'axios';
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class CustomizedLabel extends PureComponent {
    render() {
      const { x, y, stroke, value } = this.props;
  
      return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
          {value}
        </text>
      );
    }
  }
  
class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, stroke, payload } = this.props;
  
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
            {payload.value}
          </text>
        </g>
      );
    }
}

const AddedPublishedGraph = () => {
    const [articleCounts, setArticleCounts] = useState([]);
    const [dateType, setDateType] = useState('added');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${window.location.origin}/articlecounts`, { dateType });
                setArticleCounts(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [dateType]);

    return (
        <div className="added_published_graph">
            <h2 style={{color:'#6680b3'}}>Article Count by Month ({dateType === 'added' ? 'Added' : 'Published'})</h2>
            <div>
                <label style={{color:'teal',fontWeight:'bold'}}>Select Date Type: </label>
                <select style={{ height:'30px',width:'90px',borderRadius:'10px'}}value={dateType} onChange={(e) => setDateType(e.target.value)}>
                    <option value="added">Added</option>
                    <option value="published">Published</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={articleCounts}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="red" label={<CustomizedLabel />} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AddedPublishedGraph;

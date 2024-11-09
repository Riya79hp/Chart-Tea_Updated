import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Added_Published() {
    const [month, setMonth] = useState('December'); 
    const [dateType, setDateType] = useState('added');
    const [count, setCount] = useState(null);
    const [error, setError] = useState('');

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleDateTypeChange = (event) => {
        setDateType(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!month || !dateType) {
                setError('Please select both month and date type');
                return;
            }

            try {
                const response = await axios.post(`${window.location.origin}/datecount`, {
                    inputMonth: month,
                    dateType: dateType
                });
                setCount(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [month, dateType]);

    return (
        <div className="added_published">
            <h1 style={{color:'brown'}}>Article Date Count</h1>
            <form>
                <label>
                    Select Month:
                    <select className="added_published_input" value={month} onChange={handleMonthChange}>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                </label>
                <label>
                    Select Date Type:
                    <select className="added_published_input" value={dateType} onChange={handleDateTypeChange}>
                        <option value="added">Added</option>
                        <option value="published">Published</option>
                    </select>
                </label>
            </form>
            {error && <p className="added_published_error">{error}</p>}
            {count !== null && <p className="added_published_count">{count}</p>}
        </div>
    );
}

export default Added_Published;

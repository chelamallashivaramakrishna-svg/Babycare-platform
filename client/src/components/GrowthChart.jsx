import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GrowthChart = ({ data }) => {
    // data should be array of { date, height, weight }
    // processing data for chart
    const chartData = data.map(record => ({
        date: new Date(record.date).toLocaleDateString(),
        height: record.height || record.metrics?.height,
        weight: record.weight || record.metrics?.weight,
    })).filter(d => d.height || d.weight); // filter out non-growth records if mixed

    return (
        <div className="h-64 w-full bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Growth Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="height" stroke="#8884d8" name="Height (cm)" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#82ca9d" name="Weight (kg)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GrowthChart;

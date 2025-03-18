import React, { useState } from 'react';
import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    ResponsiveContainer
} from 'recharts';

const Chart = ({ rawData = [] }) => {

    //   const rawData = [
    //     {"x": "2025-03-15T10:00:00.000Z", "bp_systolic": 120, "bp_diastolic": 80, "heartRate": 75, "respiratoryRate": 16, "bodyTemperature": 37, "oxygenSaturation": 98},
    //     {"x": "2025-03-16T10:00:00.000Z", "bp_systolic": 130, "bp_diastolic": 85, "heartRate": 80, "respiratoryRate": 18, "bodyTemperature": 36.8, "oxygenSaturation": 97},
    //     {"x": "2025-03-17T10:00:00.000Z", "bp_systolic": 125, "bp_diastolic": 82, "heartRate": 78, "respiratoryRate": 17, "bodyTemperature": 37.2, "oxygenSaturation": 99},
    //     {"x": "2025-03-18T10:00:00.000Z", "bp_systolic": 140, "bp_diastolic": 90, "heartRate": 85, "respiratoryRate": 20, "bodyTemperature": 36.6, "oxygenSaturation": 96},
    //     {"x": "2025-03-19T10:00:00.000Z", "bp_systolic": 135, "bp_diastolic": 88, "heartRate": 83, "respiratoryRate": 19, "bodyTemperature": 37.1, "oxygenSaturation": 97},
    //     {"x": "2025-03-20T10:00:00.000Z", "bp_systolic": 128, "bp_diastolic": 84, "heartRate": 79, "respiratoryRate": 18, "bodyTemperature": 36.9, "oxygenSaturation": 98},
    //     {"x": "2025-03-21T10:00:00.000Z", "bp_systolic": 132, "bp_diastolic": 87, "heartRate": 82, "respiratoryRate": 18, "bodyTemperature": 37, "oxygenSaturation": 96},
    //     {"x": "2025-03-22T10:00:00.000Z", "bp_systolic": 138, "bp_diastolic": 89, "heartRate": 88, "respiratoryRate": 21, "bodyTemperature": 37.3, "oxygenSaturation": 95}
    //   ];

    // Format the data for display
    const formattedData = rawData.map(item => ({
        ...item,
        date: new Date(item.x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    // Available metrics
    const metrics = [
        { id: 'bloodPressure', name: 'Blood Pressure', fields: ['bp_systolic', 'bp_diastolic'] },
        { id: 'heartRate', name: 'Heart Rate', fields: ['heartRate'] },
        { id: 'respiratoryRate', name: 'Respiratory Rate', fields: ['respiratoryRate'] },
        { id: 'bodyTemperature', name: 'Body Temperature', fields: ['bodyTemperature'] },
        { id: 'oxygenSaturation', name: 'Oxygen Saturation', fields: ['oxygenSaturation'] }
    ];

    // State to track selected metric
    const [selectedMetric, setSelectedMetric] = useState(metrics[0]);

    // Get appropriate colors for the selected metric
    const getColors = () => {
        switch (selectedMetric.id) {
            case 'bloodPressure': return ['#1e3a8a', '#3b82f6']; // Dark blue and medium blue
            case 'heartRate': return ['#2563eb']; // Blue
            case 'respiratoryRate': return ['#60a5fa']; // Lighter blue
            case 'bodyTemperature': return ['#93c5fd']; // Light blue
            case 'oxygenSaturation': return ['#0369a1']; // Ocean blue
            default: return ['#0ea5e9']; // Sky blue
        }
    };

    // Get y-axis label based on selected metric
    const getYAxisLabel = () => {
        switch (selectedMetric.id) {
            case 'bloodPressure': return 'mmHg';
            case 'heartRate': return 'BPM';
            case 'respiratoryRate': return 'breaths/min';
            case 'bodyTemperature': return '°C';
            case 'oxygenSaturation': return '%';
            default: return '';
        }
    };

    // Get display names for the fields
    const getFieldDisplayName = (field) => {
        switch (field) {
            case 'bp_systolic': return 'Systolic';
            case 'bp_diastolic': return 'Diastolic';
            default: return selectedMetric.name;
        }
    };

    const colors = getColors();

    return (
        <div className="flex flex-col w-full h-full p-4">
            <div className="flex items-center text-gray-500 mb-4 space-x-4">
                <span className="font-medium">Select Metric:</span>
                <select
                    className="p-1 border rounded"
                    value={selectedMetric.id}
                    onChange={(e) => {
                        const metric = metrics.find(m => m.id === e.target.value);
                        setSelectedMetric(metric);
                    }}
                >
                    {metrics.map(metric => (
                        <option key={metric.id} value={metric.id}>{metric.name}</option>
                    ))}
                </select>
            </div>

            <div className="h-70 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={formattedData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            //   angle={-45} 
                            textAnchor="end"
                            height={50}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            label={{
                                value: getYAxisLabel(),
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <Tooltip />
                        <Legend />

                        {selectedMetric.fields.map((field, index) => (
                            <Bar
                                key={field}
                                dataKey={field}
                                name={getFieldDisplayName(field)}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Chart;
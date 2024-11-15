import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getTopicAnalysis } from '../services/api';

const TopicAnalysis = ({ company }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!company) return;
      setLoading(true);
      setError(null);
      try {
        const topicsData = await getTopicAnalysis(company.symbol);
        // Sort topics by frequency in descending order
        const sortedData = topicsData.sort((a, b) => b.frequency - a.frequency);
        setData(sortedData);
      } catch (err) {
        setError('Failed to fetch topic analysis');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [company]);

  if (!company) {
    return (
      <Box>
        <Typography variant="h6" color="primary" gutterBottom>
          Topic Analysis
        </Typography>
        <Typography variant="body1">
          Select a company to view topic analysis
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Key Topics - {company.symbol}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
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
          <XAxis 
            dataKey="topic" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis 
            label={{ 
              value: 'Frequency', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="frequency" 
            fill="#8884d8" 
            name="Mentions"
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TopicAnalysis;

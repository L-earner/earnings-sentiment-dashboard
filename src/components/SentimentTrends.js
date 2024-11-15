import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getSentimentTrends } from '../services/api';

const SentimentTrends = ({ company }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      if (!company) return;
      setLoading(true);
      setError(null);
      try {
        const trendsData = await getSentimentTrends(company.symbol);
        // Transform the data for the chart
        const transformedData = trendsData.map(item => ({
          period: item.period_identifier,
          sentiment: convertToneToNumber(item.overall_tone),
          date: item.date
        }));
        setData(transformedData);
      } catch (err) {
        setError('Failed to fetch sentiment trends');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [company]);

  // Helper function to convert tone to numerical value
  const convertToneToNumber = (tone) => {
    const toneMap = {
      'Very Positive': 1.0,
      'Positive': 0.75,
      'Neutral': 0.5,
      'Negative': 0.25,
      'Very Negative': 0.0
    };
    return toneMap[tone] || 0.5;
  };

  if (!company) {
    return (
      <Box>
        <Typography variant="h6" color="primary" gutterBottom>
          Sentiment Trends
        </Typography>
        <Typography variant="body1">
          Select a company to view sentiment trends
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
        Sentiment Trends - {company.symbol}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis 
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            tickFormatter={(value) => {
              const labels = {
                0: 'Very Negative',
                0.25: 'Negative',
                0.5: 'Neutral',
                0.75: 'Positive',
                1: 'Very Positive'
              };
              return labels[value] || value;
            }}
          />
          <Tooltip 
            formatter={(value) => {
              const labels = {
                0: 'Very Negative',
                0.25: 'Negative',
                0.5: 'Neutral',
                0.75: 'Positive',
                1: 'Very Positive'
              };
              return labels[value] || value;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Sentiment"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SentimentTrends;

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { getToneShifts } from '../services/api';

const ToneShiftAnalysis = ({ company }) => {
  const [toneShiftData, setToneShiftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToneShifts = async () => {
      if (!company) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getToneShifts(company.symbol);
        setToneShiftData(data);
      } catch (err) {
        setError('Failed to fetch tone shift analysis');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchToneShifts();
  }, [company]);

  const getToneIcon = (shift) => {
    if (!shift) return <TrendingFlatIcon color="info" sx={{ fontSize: 40 }} />;
    
    switch (shift.toLowerCase()) {
      case 'increase in optimism':
      case 'reversal from pessimism to optimism':
        return <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />;
      case 'decrease in optimism':
      case 'increase in pessimism':
      case 'reversal from optimism to pessimism':
        return <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />;
      default:
        return <TrendingFlatIcon color="info" sx={{ fontSize: 40 }} />;
    }
  };

  const getToneColor = (shift) => {
    if (!shift) return 'info';
    
    switch (shift.toLowerCase()) {
      case 'increase in optimism':
      case 'reversal from pessimism to optimism':
        return 'success';
      case 'decrease in optimism':
      case 'increase in pessimism':
      case 'reversal from optimism to pessimism':
        return 'error';
      default:
        return 'info';
    }
  };

  if (!company) {
    return (
      <Box>
        <Typography variant="h6" color="primary" gutterBottom>
          Tone Shift Analysis
        </Typography>
        <Typography variant="body1">
          Select a company to view tone shift analysis
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
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

  if (!toneShiftData) {
    return (
      <Box>
        <Typography variant="h6" color="primary" gutterBottom>
          No Tone Shift Data
        </Typography>
        <Typography variant="body1">
          No tone shift analysis available for this company
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CompareArrowsIcon sx={{ mr: 1 }} />
        Tone Shift Analysis
      </Typography>

      <Box sx={{ mt: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          {getToneIcon(toneShiftData.shift_in_tone)}
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom align="center">
            Period Comparison
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Chip 
              label={toneShiftData.from_period}
              size="small"
              sx={{ mr: 1 }}
            />
            <TrendingFlatIcon sx={{ mx: 1 }} />
            <Chip 
              label={toneShiftData.to_period}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom align="center">
            Tone Shift
          </Typography>
          <Box display="flex" justifyContent="center">
            <Chip 
              label={toneShiftData.shift_in_tone}
              color={getToneColor(toneShiftData.shift_in_tone)}
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Detailed Analysis
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              lineHeight: 1.8,
              textAlign: 'justify',
              whiteSpace: 'pre-wrap'
            }}
          >
            {toneShiftData.shift_description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ToneShiftAnalysis;

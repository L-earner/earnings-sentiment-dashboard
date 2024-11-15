import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import { getCompanyOverview } from '../services/api';

const CompanyOverview = ({ company }) => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!company) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getCompanyOverview(company.symbol);
        setOverviewData(data);
      } catch (err) {
        setError('Failed to fetch company overview');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [company]);

  if (!company) {
    return (
      <Box>
        <Typography variant="h6" color="primary" gutterBottom>
          Company Overview
        </Typography>
        <Typography variant="body1">
          Select a company to view its earnings call analysis
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

  if (!overviewData) {
    return (
      <Box>
        <Typography variant="h6" color="primary" gutterBottom>
          No Data Available
        </Typography>
        <Typography variant="body1">
          No analysis data available for this company
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        {company.symbol} - {company.name}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Latest Analysis Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {overviewData.date}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Overall Narrative
              </Typography>
              <Typography variant="body1" gutterBottom>
                {overviewData.overall_narrative}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Period
              </Typography>
              <Typography variant="body1" gutterBottom>
                {overviewData.analysis_period}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Management Tone
              </Typography>
              <Typography variant="body1" gutterBottom>
                {overviewData.overall_tone}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Future Outlook
              </Typography>
              <Typography variant="body1">
                {overviewData.future_outlook}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyOverview;

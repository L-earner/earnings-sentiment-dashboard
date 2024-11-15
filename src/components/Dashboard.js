import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  TextField,
  Autocomplete,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Stack
} from '@mui/material';
import { searchCompanies } from '../services/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UpdateIcon from '@mui/icons-material/Update';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Dashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!searchTerm) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await searchCompanies(searchTerm);
        console.log('Fetched data:', data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          setCompanies(data);
          setError(null);
        } else {
          setCompanies([]);
          if (searchTerm.length >= 1) {
            setError('No results found');
          }
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue) {
      setSearchTerm(newInputValue);
    } else {
      setSearchTerm('');
      setError(null);
      setCompanies([]);
    }
  };

  const handleCompanySelect = (event, newValue) => {
    console.log('Selected company:', newValue);
    setSelectedCompany(newValue);
    setError(null);
    setSearchTerm('');
  };

  const handleNavigation = async (direction) => {
    if (!selectedCompany || !selectedCompany.symbol) return;
    
    setLoading(true);
    setError(null);
    setSearchTerm('');
    
    try {
      console.log('Navigating:', {
        currentSymbol: selectedCompany.symbol,
        direction: direction
      });
      
      const data = await searchCompanies(
        selectedCompany.symbol,
        direction
      );
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('Navigation result:', data[0]);
        setSelectedCompany(data[0]);
        setInputValue(data[0].symbol); 
        setError(null); 
      } else {
        setError(`No ${direction} stock found`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setError(`Error navigating to ${direction} stock: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Just return the date string as is from the database
    return dateString;
  };

  const getToneColor = (tone) => {
    if (!tone) return 'default';
    switch (tone.toLowerCase()) {
      case 'increase in optimism':
      case 'very positive':
      case 'positive':
        return 'success';
      case 'decrease in optimism':
      case 'very negative':
      case 'negative':
        return 'error';
      case 'no significant change':
      case 'neutral':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Earnings Call Analysis Dashboard
        </Typography>
        <Autocomplete
          options={companies}
          getOptionLabel={(option) => `${option.symbol} - ${option.company_name}`}
          value={selectedCompany}
          onChange={handleCompanySelect}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Company Symbol"
              variant="outlined"
              fullWidth
              error={!!error && !!searchTerm}
              helperText={error && searchTerm ? error : ''}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Paper>

      {selectedCompany ? (
        <Grid container spacing={3}>
          {/* Navigation Buttons */}
          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Button
                variant="contained"
                startIcon={<NavigateBeforeIcon />}
                onClick={() => handleNavigation('previous')}
                disabled={loading || selectedCompany.isFirst}
                color="primary"
              >
                Previous Stock
              </Button>
              {loading && <CircularProgress size={24} />}
              <Button
                variant="contained"
                endIcon={<NavigateNextIcon />}
                onClick={() => handleNavigation('next')}
                disabled={loading || selectedCompany.isLast}
                color="primary"
              >
                Next Stock
              </Button>
            </Stack>
            {selectedCompany.totalStocks > 0 && (
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                sx={{ mt: 1 }}
              >
                {`Stock ${selectedCompany.symbol} (${selectedCompany.totalStocks} companies available)`}
              </Typography>
            )}
          </Grid>

          {/* Company Overview */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h4" component="h1">
                    {selectedCompany.symbol} - {selectedCompany.company_name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Analysis Period: {selectedCompany.analysis_period}
                  </Typography>
                </Box>
              </Box>

              {/* Sentiment Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sentiment Analysis
                </Typography>
                <Chip 
                  label={selectedCompany.sentiment_summary}
                  color={getToneColor(selectedCompany.sentiment_summary)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body1">
                  {selectedCompany.sentiment_explanation}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Financial Highlights */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Financial Highlights
              </Typography>
              {selectedCompany.financial_highlights && (() => {
                const highlights = JSON.parse(selectedCompany.financial_highlights);
                return (
                  <Box>
                    {highlights.otherMetrics?.map((metric, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {metric.metricName}
                        </Typography>
                        <Typography variant="body1">
                          Current: {metric.currentPeriod || 'N/A'} | Previous: {metric.previousPeriod || 'N/A'}
                        </Typography>
                        {metric.change && (
                          <Typography variant="body2" color="textSecondary">
                            Change: {metric.change}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                );
              })()}
            </Paper>
          </Grid>

          {/* Key Insights */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              {selectedCompany.key_insights && (
                <Box component="ul" sx={{ pl: 2 }}>
                  {JSON.parse(selectedCompany.key_insights).map((insight, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {insight}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Risks and Challenges */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Risks and Challenges
              </Typography>
              {selectedCompany.risks_and_challenges && (
                <Box component="ul" sx={{ pl: 2 }}>
                  {JSON.parse(selectedCompany.risks_and_challenges).map((risk, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {risk}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Opportunities */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Opportunities
              </Typography>
              {selectedCompany.opportunities && (
                <Box component="ul" sx={{ pl: 2 }}>
                  {JSON.parse(selectedCompany.opportunities).map((opportunity, index) => (
                    <Typography component="li" key={index} sx={{ mb: 1 }}>
                      {opportunity}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Significant Quotes */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Significant Quotes
              </Typography>
              {selectedCompany.significant_quotes && (
                <Grid container spacing={2}>
                  {JSON.parse(selectedCompany.significant_quotes).map((quote, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: '#f5f5f5',
                          borderRadius: 1,
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: 'italic',
                            mb: 1,
                            color: '#000000',
                            fontSize: '1rem',
                            lineHeight: 1.6
                          }}
                        >
                          "{quote.quote}"
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: '#000000',
                            fontWeight: 500
                          }}
                        >
                          - {quote.speaker}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Search for a company to view earnings call analysis
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;

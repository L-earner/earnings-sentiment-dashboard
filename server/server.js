require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

console.log('Attempting to connect to database with following config:');
console.log('Host:', process.env.PGHOST);
console.log('Database:', process.env.PGDATABASE);
console.log('User:', process.env.PGUSER);
console.log('Port:', process.env.PGPORT);

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection and check table structure
pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  
  try {
    // Check transcript_analyses structure
    const taQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'transcript_analyses'
    `;
    const taResult = await client.query(taQuery);
    console.log('transcript_analyses structure:', taResult.rows);

    const countResult = await client.query('SELECT COUNT(*) FROM transcript_analyses');
    console.log('Row count:', countResult.rows[0].count);
    
    console.log('Successfully connected to PostgreSQL database');
  } catch (err) {
    console.error('Error checking database structure:', err);
  } finally {
    release();
  }
});

// API Endpoints

app.get('/api/companies/search', async (req, res) => {
  const { term, direction } = req.query;
  console.log('Search request params:', { term, direction });

  try {
    let query;
    let queryParams;

    if (term && direction) {
      // If direction is provided, fetch the next/previous stock
      console.log('Fetching with navigation:', { direction, term });
      const operator = direction === 'next' ? '>' : '<';
      const orderDirection = direction === 'next' ? 'ASC' : 'DESC';
      
      query = `
        WITH latest_records AS (
          SELECT DISTINCT ON (symbol) 
            id,
            symbol,
            company_name,
            date,
            analysis_period,
            financial_highlights,
            key_insights,
            risks_and_challenges,
            opportunities,
            significant_quotes,
            sentiment_summary,
            sentiment_explanation
          FROM transcript_analyses
          ORDER BY symbol, date DESC
        )
        SELECT * FROM latest_records
        WHERE symbol ${operator} $1
        ORDER BY symbol ${orderDirection}
        LIMIT 1
      `;
      queryParams = [term];
      console.log('Navigation query:', query.replace(/\s+/g, ' '));
      console.log('Query params:', queryParams);
    } else if (term) {
      // If just term provided, fetch that specific stock's latest transcript
      console.log('Fetching specific stock');
      query = `
        SELECT 
          id,
          symbol,
          company_name,
          date,
          analysis_period,
          financial_highlights,
          key_insights,
          risks_and_challenges,
          opportunities,
          significant_quotes,
          sentiment_summary,
          sentiment_explanation
        FROM transcript_analyses
        WHERE UPPER(symbol) = UPPER($1)
        ORDER BY date DESC
        LIMIT 1
      `;
      queryParams = [term];
    } else {
      // If no term, fetch the first stock alphabetically (with its latest transcript)
      console.log('Fetching first stock');
      query = `
        WITH latest_records AS (
          SELECT DISTINCT ON (symbol) 
            id,
            symbol,
            company_name,
            date,
            analysis_period,
            financial_highlights,
            key_insights,
            risks_and_challenges,
            opportunities,
            significant_quotes,
            sentiment_summary,
            sentiment_explanation
          FROM transcript_analyses
          ORDER BY symbol, date DESC
        )
        SELECT * FROM latest_records
        ORDER BY symbol ASC
        LIMIT 1
      `;
      queryParams = [];
    }
    
    const result = await pool.query(query, queryParams);
    console.log('Query result rows:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('No results found');
      return res.json([]);
    }

    // Get total count and symbol range
    const metadataQuery = `
      WITH latest_records AS (
        SELECT DISTINCT ON (symbol) 
          symbol,
          date
        FROM transcript_analyses
        ORDER BY symbol, date DESC
      )
      SELECT 
        COUNT(*) as total,
        MIN(symbol) as first_symbol,
        MAX(symbol) as last_symbol
      FROM latest_records
    `;
    const metadataResult = await pool.query(metadataQuery);
    const metadata = metadataResult.rows[0];
    console.log('Metadata:', metadata);
    
    const currentRecord = result.rows[0];
    
    // Add navigation metadata to the response
    const response = {
      ...currentRecord,
      isFirst: currentRecord.symbol === metadata.first_symbol,
      isLast: currentRecord.symbol === metadata.last_symbol,
      totalStocks: parseInt(metadata.total)
    };

    console.log('Sending response with navigation metadata:', {
      symbol: response.symbol,
      date: response.date,
      isFirst: response.isFirst,
      isLast: response.isLast,
      totalStocks: response.totalStocks
    });
    
    res.json([response]);

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'An error occurred while fetching the data',
      details: err.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

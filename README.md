# Earnings Call Analysis Dashboard

A modern, interactive dashboard for analyzing earnings call transcripts and sentiment data. Built with React and Material-UI, featuring real-time data visualization and comprehensive analysis tools.

## Features

- 📊 Interactive data visualization with Recharts
- 🔍 Company search functionality
- 📈 Sentiment trend analysis
- 📋 Topic frequency analysis
- 🔄 Tone shift tracking
- 💼 Comprehensive company overviews

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/earnings-dashboard.git
cd earnings-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
REACT_APP_API_URL=your_api_url
```

## Project Structure

```
src/
  ├── components/         # React components
  │   ├── CompanyOverview.js
  │   ├── Dashboard.js
  │   ├── Navbar.js
  │   ├── SentimentTrends.js
  │   ├── TopicAnalysis.js
  │   └── ToneShiftAnalysis.js
  ├── App.js             # Main application component
  └── index.js           # Application entry point
```

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Material-UI](https://mui.com/) - UI components
- [Recharts](https://recharts.org/) - Data visualization
- [React Router](https://reactrouter.com/) - Navigation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

// Import required modules
const express = require('express'); // Import Express framework
const path = require('path'); // Import Path module
const stocks = require('./stocks'); // Import custom module for fetching stock data

// Create an Express app instance
const app = express();

// Serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, 'static')));

// Define a route for handling GET requests to '/stocks'
app.get('/stocks', async (req, res) => {
  try {
    // Attempt to retrieve stock symbols asynchronously
    const stockSymbols = await stocks.getStocks();
    console.log(stockSymbols); // Log the retrieved stock symbols to the console

    // Send the list of stock symbols as a JSON response
    res.json({ stockSymbols });
  } catch (error) {
    // Log any errors to the console
    console.error('Error retrieving stock data:', error);
    
    // Send an error response to the client with status code 500
    res.status(500).send('Error retrieving stock data. Please try again later.');
  }
});

// Define a route to handle GET requests for retrieving stock data
// The route expects a symbol parameter in the URL
app.get('/stocks/:symbol', async (req, res) => {
  // Extract the symbol parameter from the request URL
  const { symbol } = req.params;
  try {
    // Attempt to retrieve stock data for the specified symbol
    const data = await stocks.getStockPoints(symbol, new Date());
    // Send the stock data as a response
    console.log(symbol, data);
    res.json(data);
  } catch (error) {
    // Log the error to the console
    console.error(`Error retrieving stock data for symbol ${symbol}:`, error);
    // Send an error response to the client with status code 500
    res.status(500).send(`Error retrieving stock data for symbol ${symbol}. Please try again later.`);
  }
});

// Start the server and listen for incoming requests on port 3000
app.listen(3000, () => console.log('Server is running!'));

const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
const Spinner = document.querySelector('.spinner')

function drawLine(start, end, style) {
  ctx.beginPath();  // Begin a new path
  ctx.strokeStyle = style || 'black';  // Set the stroke style (color) or default to black
  ctx.moveTo(...start);  // Move the starting point of the path to the specified coordinates
  ctx.lineTo(...end);  // Connect the starting point to the ending point with a straight line
  ctx.stroke();  // Stroke the path with the current stroke style
}

function drawTriangle(apex1, apex2, apex3) {
  ctx.beginPath();  // Begin a new path
  ctx.moveTo(...apex1);  // Move the pen to the first apex of the triangle
  ctx.lineTo(...apex2);  // Draw a line to the second apex
  ctx.lineTo(...apex3);  // Draw a line to the third apex
  ctx.fill();  // Fill the triangle with the current fill color
}

drawLine([50, 50], [50, 550]) // Draw a vertical line from (50, 50) to (50, 550)
drawTriangle([35, 50], [65, 50], [50, 35]) // Draw a triangle with vertices at (35, 50), (65, 50), and (50, 35)

drawLine([50, 550], [950, 550]) // Draw a horizontal line from (50, 550) to (950, 550)
drawTriangle([950, 535], [950, 565], [965, 550]) // Draw a triangle with vertices at (950, 535), (950, 565), and (965, 550)

// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch the list of stock symbols from the backend
  const response = await fetch('/stocks');
  if (!response.ok) {
    // If the response is not ok, throw an error
    throw new Error('Failed to fetch stocks');
  }
  // Parse the response body as JSON
  let errorCount = 0;
  const data = await response.json();
  const stocks = {};

  // Loop through the list of stock symbols until either all are processed or error count exceeds 3
  while (data.stockSymbols.length > 0 && errorCount < 3) {
    // Pop a symbol from the list
    const symbol = data.stockSymbols.pop();
    // Fetch stock data for the current symbol
    const stockData = await fetch(`/stocks/${symbol}`);
    if (!stockData.ok) {
      // If fetching stock data fails, push back the symbol and log an error
      data.stockSymbols.push(symbol);
      let error = new Error(`Failed to fetch data for stock ${symbol}`);
      console.error('Error:', error);
      errorCount++;
    } else {
      // If fetching stock data succeeds, parse the response body as JSON
      const stock = await stockData.json();
      // Store the stock data in the 'stocks' object with the symbol as the key
      stocks[symbol] = stock;
    }
  }
  // Hide the spinner once all stock data has been fetched or error limit exceeded
  Spinner.classList.add('hide');
  // Loop through the fetched stocks
  for (const stock in stocks) {
    console.log(`Data for stock ${stock}:`);
    const stockPrices = stocks[stock];
    // Log and draw chart for each stock
    for (const price of stockPrices) {
      console.log(`Timestamp: ${new Date(price.timestamp).toLocaleString()}, Value: \$${price.value}`);
    }
    drawChart(stocks[stock]);
  }
});

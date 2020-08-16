/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function getMonthlyData() {

  // variable apiKey must be defined in secret.js
  const queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
  d3.json(queryUrl).then(function(jsonData) {
    // @TODO: Unpack the dates, open, high, low, close, and volume
    const dates = unpack(jsonData.dataset.data, 0);
    const openPrices = unpack(jsonData.dataset.data, 1);
    const highPrices = unpack(jsonData.dataset.data, 2);
    const lowPrices = unpack(jsonData.dataset.data, 3);
    const closingPrices = unpack(jsonData.dataset.data, 4);
    const volume = unpack(jsonData.dataset.data, 5);
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  const table = d3.select("#summary-table");
  const tbody = table.select("tbody");
  let trow;
  for (let i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function buildPlot() {
  const url = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

  d3.json(url).then(function(jsonData) {

    // @TODO: Grab Name, Stock, Start Date, and End Date from the response json object to build the plots
    const name = jsonData.dataset.name;
    const stock = jsonData.dataset.dataset_code;
    const startDate = jsonData.dataset.start_date;
    const endDate = jsonData.dataset.end_date;
    // @TODO: Unpack the dates, open, high, low, and close prices
    const dates = unpack(jsonData.dataset.data, 0);
    const openPrices = unpack(jsonData.dataset.data, 1);
    const highPrices = unpack(jsonData.dataset.data, 2);
    const lowPrices = unpack(jsonData.dataset.data, 3);
    const closingPrices = unpack(jsonData.dataset.data, 4);
    

    getMonthlyData();

    // Closing Scatter Line Trace
    const trace1 = {
      // @TODO: YOUR CODE HERE
      x: dates,
      y: closingPrices,
      name: `${stock} closing Prices`,
      type:'scatter',
      mode: "lines",
      line: {
        color: "#17BECF"
      }
      
    };

    // Candlestick Trace
    const trace2 = {
      // @TODO: YOUR CODE HERE
      x: dates,
      open: openPrices,
      close: closingPrices,
      low: lowPrices,
      high: highPrices,
      type:'candlestick',
      name: `${stock} Candlestick`
    };

    const traceArr = [trace1, trace2];

    const layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: true
    };

    Plotly.newPlot("plot", traceArr, layout);

  });
}

buildPlot();

const express = require("express");
const ejs = require("ejs");
const coinGecko = require("coingecko-api");
const fetch = (...args) =>
  import('node-fetch').then(({
    default: fetch
  }) => fetch(...args));

const app = express();
const coinGeckoClient = new coinGecko();

const PORT = process.env.PORT || 3000;

// These will format the data for the price chart later
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const capFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0
});

app.set("view engine", "ejs");
app.use(express.static("public"));

// API URL for CoinGecko
const api_url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";

app.get("/", async (req, res) => {
  // Fetch data from CoinGecko API
  const fetch_response = await fetch(api_url);
  const json = await fetch_response.json();

  // Format fetched data for the chart and push it to an array
  // that will be passed to the price chart
  let priceData = [];

  for (var i = 0; i < json.length; i++) {
    priceData.push({
      image: json[i].image,
      id: json[i].id.charAt(0).toUpperCase() + json[i].id.slice(1),
      symbol: json[i].symbol.toUpperCase(),
      current_price: formatter.format(json[i].current_price),
      price_change_percentage_24h_in_currency: parseFloat(json[i].price_change_percentage_24h_in_currency).toFixed(2) + "%",
      market_cap: capFormatter.format(json[i].market_cap)
    });
  }

  // Render homepage with data from the array full of formatted data
  res.render("home", {
    priceData: priceData
  });
});

app.listen(3000, () => {
  console.log(`Server started on port ${PORT}.`);
});

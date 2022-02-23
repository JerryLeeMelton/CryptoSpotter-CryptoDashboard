const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const coinGecko = require("coingecko-api");
const https = require("https");
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const app = express();
const coinGeckoClient = new coinGecko();

app.set("view engine", "ejs");
app.use(express.static("public"));

const api_url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";


app.get("/", async (req, res) => {
  const fetch_response = await fetch(api_url);
  const json = await fetch_response.json();
  let priceData = [];

  for (var i = 0; i < json.length; i++) {
    priceData.push({
      image: json[i].image,
      id: json[i].id.charAt(0).toUpperCase() + json[i].id.slice(1),
      symbol: json[i].symbol.toUpperCase(),
      current_price: formatter.format(json[i].current_price),
      price_change_percentage_24h_in_currency: parseFloat(json[i].price_change_percentage_24h_in_currency).toFixed(2) + "%",
      market_cap: formatter.format(json[i].market_cap)
    });
  }

  res.render("home", {
    priceData: priceData
  });
});

app.get("/api", (req, res) => {
  res.render("home");
});





app.listen(3000, () => {
  console.log("Server started on port 3000.");
});

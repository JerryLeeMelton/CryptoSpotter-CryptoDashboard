const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const coinGecko = require("coingecko-api");

const app = express();
const coinGeckoClient = new coinGecko();

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/api", (req, res) => {
  res.render("home");
});





app.listen(3000, () => {
  console.log("Server started on port 3000.");
  getPrices();
});


var getPrices = async() => {
  const params = {
    vs_currency: "usd",
    per_page: 25,
    order: coinGecko.ORDER.MARKET_CAP_DESC,
    price_change_percentage: "24h"
  };

  const result = await coinGeckoClient.coins.markets({params});

  console.log(result);

  return result;
};

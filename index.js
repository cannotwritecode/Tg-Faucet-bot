const express = require("express");
const bodyParser = require("body-parser");
const handler = require("./api/webhook.js");

const app = express();
app.use(bodyParser.json());

// webhook endpoint
app.post("/webhook", handler);

// default GET
app.get("/", (req, res) => {
  res.send("Bot is running on Render");
});

// Render uses process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

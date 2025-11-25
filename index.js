const express = require("express");

const handler = require("./api/webhook");

const app = express();
app.use(express.json());

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

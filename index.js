const express = require("express");
const cors = require("cors");

const musicRoute = require("./routes/music");

const app = express();

app.use(cors());
app.use(express.json());

// MAIN ROUTE
app.use("/music", musicRoute);

app.get("/", (req, res) => {
  res.json({ status: "AI Music Backend Ready" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

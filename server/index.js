const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

console.log("inizializzando Server Signal");

const app = express();

app.use(cors());
app.use(express.json());

try {
  const signalRoutes = require("./routing/signals");
  console.log("Routes caricate");
  app.use("/api/signals", signalRoutes);
} catch (err) {
  console.error("Errore nel caricamento:", err.message);
}

try {
  const connectionRoutes = require("./routing/connections");
  console.log("✅ Connection routes loaded");
  app.use("/api/connections", connectionRoutes);
} catch (err) {
  console.error("❌ Error loading connection routes:", err.message);
}

app.get("/", (req, res) => {
  res.json({ message: "Api di Signal in corso" });
});

// health status

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
console.log(`Tentativo sulla porta: ${PORT}`);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server aperto in http://0.0.0.0:${PORT}`);
});

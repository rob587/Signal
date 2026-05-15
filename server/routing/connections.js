const express = require("express");
const router = express.Router();
const {
  findConnections,
  getConnections,
} = require("../controllers/connectionController");

console.log("Route connections in caricamento");

router.post("/find", findConnections);
router.get("/all", getConnections);

module.exports = router;

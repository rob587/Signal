const express = require("express");
const router = express.Router();
const { createSignal, getSignals } = require("../controllers/signalController");

console.log("le route stanno caricando..");

router.post("/create", createSignal);
router.post("/all", getSignals);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createSignal,
  getSignals,
  editSignal,
  deleteSignal,
} = require("../controllers/signalController");

console.log("le route stanno caricando..");

router.post("/create", createSignal);
router.get("/all", getSignals);
router.delete("/:id", deleteSignal);
router.put("/:id", editSignal);

module.exports = router;

const pool = require("../db");

const createSignal = async (req, res) => {
  try {
    const { user_id, content, signal_type, mood, tags } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content richiesto" });
    }

    console.log("creando signal:", content);

    const query = `
      INSERT INTO signals (user_id, content, signal_type, mood, tags)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
};

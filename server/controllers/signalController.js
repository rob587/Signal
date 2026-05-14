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

    const result = await pool.query(query, [
      user_id || 1,
      content,
      signal_type || "note",
      mood || "neutral",
      tags || [],
    ]);

    console.log("signal creato:", result.rows[0]);

    res.json({
      success: true,
      signal: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
};

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

const getSignals = async (req, res) => {
  try {
    const query = `SELECT * FROM signals ORDER BY created_at DESC;`;
    const result = await pool.query(query);

    res.json({
      success: true,
      signals: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINA un segnale
const deleteSignal = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Prima elimina le connessioni collegate
    await pool.query(
      "DELETE FROM connections WHERE signal_id_1 = $1 OR signal_id_2 = $1",
      [id],
    );

    // 2. Poi elimina il segnale
    const result = await pool.query(
      "DELETE FROM signals WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Segnale non trovato",
      });
    }

    res.json({
      message: "Segnale eliminato con successo",
      signal: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Errore eliminazione:", error);
    res.status(500).json({
      error: "Errore durante l'eliminazione del segnale",
    });
  }
};

// MODIFICA un segnale
const editSignal = async (req, res) => {
  const { id } = req.params;
  const { content, mood } = req.body;

  // Validazione base
  if (!content) {
    return res.status(400).json({
      error: "Il contenuto è obbligatorio",
    });
  }

  try {
    // Aggiorna il segnale
    const result = await pool.query(
      `UPDATE signals 
       SET content = $1, mood = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [content, mood, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Segnale non trovato",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Errore modifica:", error);
    res.status(500).json({
      error: "Errore durante la modifica del segnale",
    });
  }
};

module.exports = { createSignal, getSignals, deleteSignal, editSignal };

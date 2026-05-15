const pool = require("../db");
const { analyzeSignalConnections } = require("../services/aiService");

const findConnections = async (req, res) => {
  try {
    const { signal_id } = req.body;

    if (!signal_id) {
      return res.status(400).json({ error: "signal_id richiesto.." });
    }

    console.log("cercando connections per Signal:", signal_id);

    const currentSignalResult = await pool.query(
      "SELECT * FROM signals WHERE id = $1",
      [signal_id],
    );

    if (currentSignalResult.rows.length === 0) {
      return res.status(404).json({ error: "Signal non trovato" });
    }

    const currentSignal = currentSignalResult.rows[0];

    const allSignalsResult = await pool.query(
      "SELECT * FROM signals WHERE id != $1 ORDER BY created_at DESC",
      [signal_id],
    );

    const allSignals = allSignalsResult.rows;

    if (allSignals.length === 0) {
      return res.json({
        success: true,
        connections: [],
        message: "No other signals to connect with",
      });
    }

    // analizza con AI
    const aiConnections = await analyzeSignalConnections(
      currentSignal,
      allSignals,
    );

    const savedConnections = [];

    for (const conn of aiConnections) {
      const query = `
        INSERT INTO connections (signal_id_1, signal_id_2, strength, relationship_type)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
        RETURNING *;
      `;

      const result = await pool.query(query, [
        signal_id,
        conn.signal_id,
        conn.strength,
        conn.relationship_type,
      ]);

      if (result.rows.length > 0) {
        savedConnections.push(result.rows[0]);
      }
    }

    console.log("Connection Salvata:", savedConnections.length);

    res.json({
      success: true,
      connections_found: savedConnections.length,
      connections: savedConnections,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getConnections = async (req, res) => {
  try {
    const { signal_id } = req.query;

    let query = "SELECT * FROM connections ORDER BY strength DESC";
    let params = [];

    if (signal_id) {
      query = `
        SELECT * FROM connections 
        WHERE signal_id_1 = $1 OR signal_id_2 = $1
        ORDER BY strength DESC
      `;
      params = [signal_id];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      connections: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getConnections, findConnections };

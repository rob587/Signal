const pool = require("../db");
const { analyzeSignalConnections } = require("../services/aiService");


const findConnections = async (req, res) => {
    try {
        const {signal_id} = req.body;

        if(!signal_id){
          return res.status(400).json({ error: "signal_id richiesto.." });  
        }

        console.log('cercando connections per Signal:', signal_id)

        const currentSignalResult = await pool.query(  "SELECT * FROM signals WHERE id = $1",
      [signal_id]);

      if(currentSignalResult.rows.length=== 0){
        return res.status(404).json({ error: "Signal non trovato" });
      }

       const currentSignal = currentSignalResult.rows[0];

        const allSignalsResult = await pool.query(
      "SELECT * FROM signals WHERE id != $1 ORDER BY created_at DESC",
      [signal_id]
    );

    const allSignals = allSignalsResult.rows;

    if (allSignals.length === 0) {
      return res.json({
        success: true,
        connections: [],
        message: "No other signals to connect with",
      });
    }
    }
}
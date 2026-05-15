const pool = require("../db");
const { analyzeSignalConnections } = require("../services/aiService");


const findConnections = async (req, res) => {
    try {
        const {signal_id} = req.body;

        if(!signal_id){
          return res.status(400).json({ error: "signal_id richiesto.." });  
        }

        console.log('cercando connections per Signal:', signal_id)
    }
}
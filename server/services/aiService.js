const axios = require("axios");

const analyzeSignalConnections = async (currentSignal, allSignals) => {
  try {
    console.log("analizzando con Groq..");

    const signalTexts = allSignals
      .map(
        (s, i) =>
          `Signal ${i + 1}: "${s.content}" (mood: ${s.mood}, type: ${s.signal_type})`,
      )
      .join("\n");

    const prompt = `
Tu sei un AI che trova connessioni tra idee.

Signal da analizzare:
"${currentSignal.content}" (mood: ${currentSignal.mood}, type: ${currentSignal.signal_type})

Altri signals nel sistema:
${signalTexts}

TASK:
1. Identifica quali altri signals sono collegati a questo
2. Per ogni connessione, ritorna SOLO JSON valido (no markdown):
{
  "signal_id": <numero>,
  "strength": <0.0 a 1.0>,
  "relationship_type": "<type>",
  "reason": "<motivo connessione>"
}

EXAMPLES di relationship_type:
- "same_topic" (stesso argomento)
- "complementary" (si completano)
- "contradiction" (si contraddicono)
- "same_framework" (stesso framework/tech)
- "related_problem" (problema correlato)

Ritorna SOLO array JSON, no spiegazioni!
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      },
    );

    let content = response.data.choices[0].message.content;
    console.log("risposta AI:", content);

    // Estraggo SOLO l'array JSON (tra [ e ])
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const jsonString = jsonMatch[0];
    console.log("JSON estratto:", jsonString);

    // parsing json
    const connections = JSON.parse(jsonString);

    console.log("parsing delle connections:", connections);
    return connections;
  } catch (error) {
    console.error("❌ Groq Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { analyzeSignalConnections };

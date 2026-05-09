const { chatWithCoach } = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await chatWithCoach({ message, history });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("chatWithAI Error:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  chatWithAI,
};

import OpenAI from "openai";
import "dotenv/config";
import Agent from "../models/Agent.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function validateAgentAndRespond(req, res) {
  try {
    const { agentName, agentMessage } = req.body;
    if (!agentMessage || !agentName) {
      return res.status(400).json({ message: "Please provide the info first" });
    }
    const isAgentexist = await Agent.findOne({ name: agentName });
    if (!isAgentexist) {
      return res.status(400).json({ message: "Agent does not exists" });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `You are ${agentName}, an AI agent with the following personality: "${isAgentexist.personality}". 
                Respond to the user based on this personality.`,
        },
        { role: "user", content: agentMessage },
      ],
    });
    const outputItems = response.output[0];

    const agentReply =
      outputItems?.type === "message" &&
      outputItem.content[0]?.type === "output_text"
        ? outputItem.content[0].text
        : "I'm sorry, I couldn't process your request.";
    console.log(`Agent ${agentName}: ${agentReply}`);
  } catch (error) {
    console.log(`An error occured while responding to the agent ${error}`);
    return res.status(500).json({ message: "internal server error" });
  }
}

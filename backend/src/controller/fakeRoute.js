//This route exists for testing purpose cause we can't just deploy a token on 
//mainnet to test weather AI will work or not 

import Agent from "../models/Agent.js";

export async function testing(req, res) {
  try {
    const { name, description, personality } = req.body;

    if (!name || !description || !personality) {
      return res.status(400).json({ message: "All fields required" });
    }

    const agent = await Agent.findOne({ name });

    if (agent) {
      return res.status(400).json({ message: "agent already exists" });
    }

    const newAgent = new Agent({ name, description, personality });
    const savedAgent = await newAgent.save();

    console.log("agent created");

    return res.status(201).json({
      message: "agent created nacho bisi",
      agentId: savedAgent._id,
      name,
      personality,
      description,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}

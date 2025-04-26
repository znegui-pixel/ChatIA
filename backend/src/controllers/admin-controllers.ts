import fs from "fs/promises";
import path from "path";
import QuestionLog from "../models/QuestionLog.js";

export const questionsPerTag = async (_, res) => {
  const data = await QuestionLog.aggregate([
    { $group: { _id: "$tag", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json(data);
};

export const dailyVolume = async (_, res) => {
  const data = await QuestionLog.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json(data);
};

const intentsPath = path.resolve("NLP-Service/intents.json");

export const getIntents = async (_, res) => {
  const file = await fs.readFile(intentsPath, "utf8");
  const json = JSON.parse(file);
  res.json(json.intents);
};

export const addIntent = async (req, res) => {
  const intent = req.body; // {tag, patterns[], responses[]}
  const file = await fs.readFile(intentsPath, "utf8");
  const json = JSON.parse(file);
  json.intents.push(intent);
  await fs.writeFile(intentsPath, JSON.stringify(json, null, 2), "utf8");

  res.json({ message: "Intent ajoutée avec succès" });
};

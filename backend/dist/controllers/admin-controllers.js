import fs from "fs/promises";
import path from "path";
import QuestionLog from "../models/QuestionLog.js";
import User from "../models/User.js";
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
export const getGlobalStats = async (_, res) => {
    const [totalUsers, totalQuestions, tagsData] = await Promise.all([
        User.countDocuments(),
        QuestionLog.countDocuments(),
        QuestionLog.aggregate([
            { $group: { _id: "$tag", count: { $sum: 1 } } }
        ])
    ]);
    res.json({
        totalUsers,
        totalQuestions,
        totalIntents: tagsData.length, // Nombre de tags différents
        usersPerRole: {
            admin: await User.countDocuments({ email: "admin@gmail.com" }),
            user: totalUsers - await User.countDocuments({ email: "admin@gmail.com" })
        }
    });
};

export const getAllUsers = async (req, res) => {
    try {
      console.log("JWT Data:", res.locals.jwtData);  // Vérifiez que les données du token sont présentes
      const users = await User.find({}, "-password").sort({ createdAt: -1 });  // Exclut le champ 'password'
      res.json({ users });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
  };
  
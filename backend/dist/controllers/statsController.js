import QuestionLog from "../models/QuestionLog.js";
import User from "../models/User.js";

// Volume de questions par jour
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

// Nombre de questions par tag (intent)
export const questionsPerTag = async (_, res) => {
    const data = await QuestionLog.aggregate([
        { $group: { _id: "$tag", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
    res.json(data);
};

// Statistiques globales
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
        totalIntents: tagsData.length,
        usersPerRole: {
            admin: await User.countDocuments({ email: "admin@gmail.com" }),
            user: totalUsers - await User.countDocuments({ email: "admin@gmail.com" })
        }
    });
};

// Fonction pour récupérer toutes les questions
export const getAllQuestions = async (_, res) => {
    try {
        const questions = await QuestionLog.find(); // Récupérer toutes les questions
        res.json(questions); // Retourner les questions au format JSON
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des questions", error });
    }
};

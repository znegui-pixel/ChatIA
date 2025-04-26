import mongoose from "mongoose";

const questionLogSchema = new mongoose.Schema({
  question: { type: String, required: true },
  response: { type: String, required: true },
  tag: { type: String },
  confidence: { type: Number },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

export default mongoose.model("QuestionLog", questionLogSchema);

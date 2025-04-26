import mongoose from "mongoose";
import { randomUUID } from "crypto";
const chatSchema = new mongoose.Schema({
    id: { type: String, default: randomUUID },
    role: { type: String, required: true },
    content: { type: String, required: true },
});
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, //  NEW
    chats: [chatSchema],
});
export default mongoose.model("User", userSchema);

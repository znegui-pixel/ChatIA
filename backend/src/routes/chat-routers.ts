import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, generateLocalChat, getAllLogs, sendChatsToUser } from "../controllers/chat-controllers.js";

const chatRoutes = Router();
chatRoutes.post("/new" ,validate(chatCompletionValidator), verifyToken, generateChatCompletion);


chatRoutes.get("/all-chats" , verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats );
chatRoutes.post("/local-nlp", validate(chatCompletionValidator), verifyToken, generateLocalChat);
chatRoutes.get("/logs", verifyToken, getAllLogs);


export default chatRoutes;

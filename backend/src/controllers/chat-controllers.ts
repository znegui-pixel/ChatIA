import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openia-config.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import axios from "axios";
import { NLP_SERVICE_URL } from "../config/nlp-config.js";
import QuestionLog from "../models/QuestionLog.js"
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

    // D'abord essayer le service NLP personnalisé
    try {
      const nlpResponse = await axios.post(`${NLP_SERVICE_URL}/predict`, {
        message
      });
      
      if (nlpResponse.data.response) {
        // Ajouter la conversation à l'historique utilisateur
        user.chats.push({ content: message, role: "user" });
        user.chats.push({ 
          content: nlpResponse.data.response, 
          role: "assistant" 
        });
        await user.save();
        
        return res.status(200).json({ 
          chats: user.chats,
          source: "custom-nlp"
        });
      }
    } catch (nlpError) {
      console.log("NLP Service error, falling back to OpenAI:", nlpError);
    }

    // Fallback à OpenAI si le service NLP ne répond pas ou ne comprend pas
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    const config = configureOpenAI();
    const openai = new OpenAIApi(config);

    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });

    user.chats.push(
      chatResponse.data.choices[0].message as ChatCompletionRequestMessage
    );
    await user.save();
    
    return res.status(200).json({ 
      chats: user.chats,
      source: "openai"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


  export const sendChatsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
      return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error:any) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };
  export const deleteChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
      //@ts-ignore
      user.chats = [];
      await user.save();
      return res.status(200).json({ message: "OK" });
    } catch (error:any) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };
  export const generateLocalChat = async (req: Request, res: Response) => {
    const { message } = req.body;
    const userId = res.locals.jwtData?.id || null;
  
    try {
      // 📡 Appel à ton serveur Flask NLP
      const response = await axios.post("http://localhost:5001/predict", { message });
  
      const nlpReply = response.data.response;
      const tag = response.data.tag;               // si tu retournes tag
      const confidence = response.data.confidence; // si tu retournes score
  
      // 📚 Sauvegarder la question + réponse dans MongoDB
      const log = new QuestionLog({
        question: message,
        response: nlpReply,
        tag,
        confidence,
        userId,
      });
  
      await log.save();
  
      return res.status(200).json({
        chats: [
          { role: "user", content: message },
          { role: "assistant", content: nlpReply },
        ]
      });
    } catch (error:any) {
      console.error(error);
      return res.status(500).json({ message: "Erreur NLP local", cause: error.message });
    }
  };
  
 export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const logs = await QuestionLog.find().populate("userId", "name email").sort({ createdAt: -1 });
    return res.status(200).json({ logs });
  } catch (err) {
    return res.status(500).json({ message: "Erreur de récupération des logs" });
  }
};
 
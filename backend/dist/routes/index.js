import { Router } from "express";
import userRouter from "./user-routes.js";
import chatRoutes from "./chat-routers.js";
import adminRouter from "./admin-routes.js";
const appRouter = Router();
appRouter.use("/user", userRouter);
appRouter.use("/chat", chatRoutes);
appRouter.use("/admin", adminRouter);
export default appRouter;

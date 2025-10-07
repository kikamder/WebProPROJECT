import morgan from "morgan";
import {logger} from "./logger.js";
import {requireAuth , authGuard , sessionMiddleware , attachUser} from "./auth.js";


export const initMiddleware = (app) => {
  app.use(morgan("dev"));
  app.use(logger);
  app.use(sessionMiddleware);
  app.use(attachUser);
  app.use(authGuard)
};

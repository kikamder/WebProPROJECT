import morgan from "morgan";
import {logger} from "./logger.js";
import {requireAuth} from "./auth.js";


export const initMiddleware = (app) => {
  app.use(morgan("dev"));
  app.use(logger);
};

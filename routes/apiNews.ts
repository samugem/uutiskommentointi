import express from "express";
import { CustomError } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";

const apiNewsRouter: express.Router = express.Router();
apiNewsRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiNewsRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(await prisma.uutinen.findMany());
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiNewsRouter;

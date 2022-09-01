import express from "express";
import { CustomError } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";

const apiCommentsRouter: express.Router = express.Router();
apiCommentsRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiCommentsRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(await prisma.kommentti.findMany());
    } catch (e: any) {
      next(new CustomError());
    }
  }
);
apiCommentsRouter.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(
        await prisma.kommentti.create({
          data: {
            comment: req.body.comment,
            newsId: req.body.newsId,
            username: req.body.username,
          },
        })
      );
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiCommentsRouter;

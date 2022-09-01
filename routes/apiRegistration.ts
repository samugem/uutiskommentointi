import express from "express";
import { CustomError } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const apiRegistrationRouter: express.Router = express.Router();
apiRegistrationRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiRegistrationRouter.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body.username && req.body.password) {
      let hash = crypto
        .createHash("SHA512")
        .update(req.body.password)
        .digest("hex");
      try {
        if (
          await prisma.kayttaja.findFirst({
            where: {
              username: req.body.username,
            },
          })
        ) {
          next(new CustomError(403));
        } else {
          res.json(
            await prisma.kayttaja.create({
              data: {
                username: req.body.username,
                password: hash,
              },
            })
          );
        }
      } catch (e: any) {
        next(new CustomError());
      }
    } else {
      next(new CustomError(400, "Käyttäjätunnus tai salasana puuttuu"));
    }
  }
);

export default apiRegistrationRouter;

import express from "express";
import path from "path";
import errorhandler from "./errors/errorhandler";
import apiNewsRouter from "./routes/apiNews";
import apiAuthRouter from "./routes/apiAuth";
import apiCommentsRouter from "./routes/apiComments";
import jwt from "jsonwebtoken";
import apiRegistrationRouter from "./routes/apiRegistration";

const app: express.Application = express();
const port: number = Number(process.env.PORT || 3106);

const checkToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let token: string = req.headers.authorization!.split(" ")[1];
    jwt.verify(token, "kalala");
    next();
  } catch (e: any) {
    res.status(401).json({});
  }
};

app.use(express.static(path.resolve(__dirname, "./public")));
app.use("/api/news", apiNewsRouter);
app.use("/api/auth", apiAuthRouter);
app.use("/api/registration", apiRegistrationRouter);
app.use("/api/comments", checkToken, apiCommentsRouter);
app.use(errorhandler);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!res.headersSent) {
      res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

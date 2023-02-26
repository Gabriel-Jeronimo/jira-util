import express from "express";

import { Router, Request, Response } from "express";
import { readStories, runRoutine } from "./service/readData.service";

const app = express();

const route = Router();

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
  runRoutine();
  res.json({ message: "hello world with Typescript" });
});

app.use(route);

app.listen(3000, () => {
  console.log("server running on port 3000");
});

import "dotenv/config";
import express from "express";
import cors from "cors";
import { deploy } from "./deploy.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/deploy", deploy);

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});

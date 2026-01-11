import "dotenv/config";
import express from "express";
import cors from "cors";
import { deploy } from "./deploy.js";

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/deploy", deploy);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

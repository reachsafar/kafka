import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./userRoute.js";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import runConsumer from "./cluster.js";
const totalCPUs = os.cpus().length;

if (runConsumer.isPrimary) {
  for (let i = 0; i < totalCPUs; i++) {
    runConsumer.fork();
  }
} else {
const app = express();
dotenv.config();

app.use(express.json());
app.use("/form", userRouter);
app.use(
  cors({
    origin: "https://sw-403.onrender",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "*",
  })
);

mongoose.connect(process.env.URL).then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port 3000 - ${process.pid}`);
  });
});
}
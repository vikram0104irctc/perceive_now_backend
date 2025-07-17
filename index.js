import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectToDatabase } from "./config/db.connection.js";
import { routes } from "./routes/route.js";
import tracingMiddleware from "./middleware/createTracingMiddleware.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(tracingMiddleware);

app.get("health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is working fine",
  });
});

app.use("/", routes);

const port = process.env.port;

async function startApplication() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error(
      "Failed to start application due to database connection error:",
      error.message
    );
    process.exit(1);
  }
}

startApplication();

app
  .listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  })
  .on("error", (err) => {
    console.error("Failed to start the server", err.message);
  });

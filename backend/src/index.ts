import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/book-routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.use(cors());
app.use(express.json());
app.use("/api", bookRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

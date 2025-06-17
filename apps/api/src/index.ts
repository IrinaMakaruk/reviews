import express from "express";
import reviewRoutes from "./routes/review.route";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", reviewRoutes);

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});

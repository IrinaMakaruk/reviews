import express from "express";
import {
  handleGetReviews,
  handleSaveReviews,
} from "../controllers/review.controller";

const router = express.Router();

router.get("/reviews/:appId", handleGetReviews);
router.post("/reviews/save", handleSaveReviews);

export default router;

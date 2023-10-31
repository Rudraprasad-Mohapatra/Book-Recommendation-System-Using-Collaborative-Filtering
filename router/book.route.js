import { Router } from "express";
import { newReleases, dailyTop100, bookData, bestSellers, upvote, downvote } from "../controller/book.controller.js";
const router = Router();

router.get("/new-releases", newReleases);
router.get("/daily-top-100", dailyTop100);
router.get("/best-sellers", bestSellers);
router.get("/:bookid", bookData);
router.post("/upvote/:bookid", upvote);
router.post("/downvote/:bookid", downvote);

export default router;
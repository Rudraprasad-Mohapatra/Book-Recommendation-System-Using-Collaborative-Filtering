import { Router } from "express";
import { newReleases, dailyTop100 } from "../controller/book.controller.js";
const router = Router();

router.get("/new-releases", newReleases);
router.get("/daily-top-100", dailyTop100);


export default router;
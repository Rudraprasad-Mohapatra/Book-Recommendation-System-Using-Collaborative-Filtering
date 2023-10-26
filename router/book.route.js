import { Router } from "express";
import { newReleases } from "../controller/book.controller.js";
const router = Router();

router.get("/new-releases", newReleases);


export default router;
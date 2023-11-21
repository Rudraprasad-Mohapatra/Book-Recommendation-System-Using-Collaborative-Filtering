import { Router } from "express";
import { register, } from "../controller/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();
router.post("/register", upload.single("avatar"), register);

export default router;
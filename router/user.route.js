import { Router } from "express";
import { register, } from "../controller/user.controller.js"
const router = Router();
router.post("/register", upload.single("avatar"), register);

export default router;
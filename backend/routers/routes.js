import { Router } from "express";
import { executeCode } from "../controllers/coding.controllers.js";

export const router=Router()

router.route('/execute').post(executeCode)
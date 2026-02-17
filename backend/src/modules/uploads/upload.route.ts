
import express from "express";
import { uploadFile,updateImageName } from "./uploads.controller";
import {upload} from "../../middlewares/upload";
const router = express.Router();


// upload file 
router.post("/", upload.single('image'), uploadFile);

// update image name 

router.put("/update", updateImageName);

export default router;
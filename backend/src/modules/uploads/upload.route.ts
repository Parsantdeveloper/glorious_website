
import express from "express";
import { uploadFile,updateImageName, deletefile } from "./uploads.controller";
import {upload} from "../../middlewares/upload";
const router = express.Router();


// upload file 
router.post("/", upload.single('image'), uploadFile);

// delete file 
router.delete("/", deletefile );


// update image name 

router.put("/update", updateImageName);


export default router;
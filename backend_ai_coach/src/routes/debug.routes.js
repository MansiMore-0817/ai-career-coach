import express from "express";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-test", upload.any(), (req, res) => {
  console.log("UPLOAD BODY:", req.body);
  console.log("UPLOAD FILES:", req.files);
  res.json({
    body: req.body,
    filesCount: req.files?.length || 0
  });
});

export default router;

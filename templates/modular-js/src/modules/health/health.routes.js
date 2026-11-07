import { Router } from "express";
const router = Router();

router.get("/", (_req, res) => {
  res.json({ success: true, message: "Nexus modular API is healthy" });
});

export default router;

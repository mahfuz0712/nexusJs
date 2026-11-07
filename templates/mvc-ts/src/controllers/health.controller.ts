import type { Request, Response } from "express";
export function getHealth(_req: Request, res: Response) {
  res.json({ success: true, message: "Nexus TypeScript MVC API is healthy" });
}

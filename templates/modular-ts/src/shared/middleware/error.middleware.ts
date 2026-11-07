import type { Request, Response, NextFunction } from "express";
export function notFound(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}
export function errorHandler(error: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error" });
}

export function notFound(req, res, _next) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error"
  });
}

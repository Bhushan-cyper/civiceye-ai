export function errorHandler(error, _req, res, _next) {
  if (error?.name === "MulterError") {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    res.status(status).json({ success: false, error: status === 413 ? "Image must be 5 MB or smaller." : error.message });
    return;
  }
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    success: false,
    error: status >= 500 ? "An unexpected server error occurred." : error.message
  });
}

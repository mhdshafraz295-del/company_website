export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexGen Solutions API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};

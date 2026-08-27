import app from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`NexGen Solutions API Server`);
  console.log(`Status: Running`);
  console.log(`Port: ${PORT}`);
  console.log(`Mode: ${config.nodeEnv}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

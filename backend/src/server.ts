import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Connect to MongoDB (optional - won't block server if it fails)
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/signup | /api/auth/login`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


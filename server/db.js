import mongoose from 'mongoose';

const RETRY_DELAY = 5000;
const MAX_RETRIES = 5;

let retries = 0;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection pool
      maxPoolSize:         10,
      minPoolSize:         2,
      // Timeouts
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS:          45000,
      connectTimeoutMS:         10000,
      // Heartbeat
      heartbeatFrequencyMS:     10000,
    });

    retries = 0;
    console.log(`[DB] Connected → ${conn.connection.host}`);

    // Graceful disconnect on app shutdown
    process.on('SIGINT',  gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (err) {
    console.error(`[DB] Connection failed (attempt ${retries + 1}/${MAX_RETRIES}):`, err.message);

    if (retries < MAX_RETRIES) {
      retries++;
      console.log(`[DB] Retrying in ${RETRY_DELAY / 1000}s…`);
      setTimeout(connectDB, RETRY_DELAY);
    } else {
      console.error('[DB] Max retries exceeded. Exiting.');
      process.exit(1);
    }
  }
};

async function gracefulShutdown() {
  await mongoose.connection.close();
  console.log('[DB] Connection closed gracefully.');
  process.exit(0);
}

// Log connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[DB] Disconnected. Attempting reconnect…');
});
mongoose.connection.on('error', err => {
  console.error('[DB] Error:', err.message);
});

export default connectDB;

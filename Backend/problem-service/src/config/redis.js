import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19808.c325.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 19808,
        reconnectStrategy: (retries) => {
            // Exponential backoff with max delay of 5 seconds
            const delay = Math.min(retries * 100, 5000);
            console.log(`Reconnecting to Redis in ${delay}ms...`);
            return delay;
        },
        connectTimeout: 5000, // 5 seconds connection timeout
        keepAlive: 10000 // Send keepalive every 10 seconds
    },
    pingInterval: 30000 // Send PING every 30 seconds to keep connection alive
});

// Error handling
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Connecting to Redis...');
});

redisClient.on('ready', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
});

// Connect to Redis when the application starts
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

export default redisClient;
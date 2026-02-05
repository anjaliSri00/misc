const express = require('express');
const dotenv = require('dotenv');
const { pool } = require('./db/connection');
const vendorRoutes = require('./vendor-feat/route');
const commonRoutes = require('./common/route');
const partnerRoutes = require('./partner-feat/route');
const leadRoutes = require('./lead/route');
const { minioClient } = require('./services/minio');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Test DB connection at startup
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL database:', err);
  });

// Test MinIO connection at startup (async/await style for minio@8.x)
(async () => {
  try {
    const buckets = await minioClient.listBuckets();
    console.log('Connected to MinIO. Buckets:', buckets.map(b => b.name).join(', '));
  } catch (err) {
    console.error('Failed to connect to MinIO:', err);
  }
})();

// CORS middleware to allow frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use('/api', vendorRoutes);
app.use('/api', commonRoutes);
app.use('/api', partnerRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Express is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

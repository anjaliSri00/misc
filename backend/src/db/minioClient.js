// mni.js
// This file handles the MinIO connection setup

const Minio = require('minio');

// Configure MinIO client using environment variables or defaults
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  useSSL: String(process.env.MINIO_USE_SSL).toLowerCase() === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

module.exports = minioClient; 
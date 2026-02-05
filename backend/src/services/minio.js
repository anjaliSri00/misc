const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  useSSL: String(process.env.MINIO_USE_SSL).toLowerCase() === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  publicBaseUrl: process.env.MINIO_PUBLIC_BASE_URL,
});

/**
 * Uploads a file to MinIO with a presigned URL return (if using private buckets)
 * @param {Object} options
 * @param {String} options.folder - Folder inside bucket (e.g., 'invoices' or 'exports/user_123')
 * @param {String} options.fileName - Name of the file with extension
 * @param {Buffer} options.fileBuffer - File content as buffer
 * @param {String} options.contentType - MIME type of the file (e.g., 'application/pdf', 'text/csv')
 * @param {Number} options.expirySeconds - Expiration time for the URL (default: 3600s)
 */

// Function to upload a file to MinIO
const uploadToMinIO = async (folder, fileName, fileBuffer, contentType = 'application/pdf') => {
  try {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    // ✅ Trim folder name to avoid accidental spaces
    const sanitizedFolder = folder.trim();
    const filePath = `${sanitizedFolder}/${fileName}`;
    // Ensure the bucket exists
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
    }
    // invoice/paymentId/

    // Upload PDF
    await minioClient.putObject(
      bucketName,
      filePath,
      fileBuffer,
      fileBuffer.length, // ✅ Required for Buffer
      {
        'Content-Type': contentType,
      },
    );

    console.log(`✅ Uploaded ${filePath} to MinIO`);

    // Generate MinIO file URL
    return `${process.env.MINIO_PUBLIC_BASE_URL}/${bucketName}/${filePath}`;

  } catch (error) {
    console.error('MinIO Upload Error:', error);
    throw new Error('Failed to upload file to MinIO');
  }
};

/**
 * Uploads an image to MinIO
 * @param {Object} options
 * @param {String} options.folder - Folder inside bucket (e.g., 'avatars', 'banners')
 * @param {String} options.fileName - Name of the image file
 * @param {Buffer} options.fileBuffer - Image buffer
 * @param {String} [options.mimeType] - Optional MIME type (defaults to 'image/jpeg')
 */
const uploadImageToMinIO = async ({ folder, fileName, fileBuffer, mimeType = 'image/jpeg' }) => {
  try {
    return await uploadToMinIO(folder, fileName, fileBuffer, mimeType);
  } catch (error) {
    console.error('Error uploading image to MinIO:', error);
    throw new Error('Image upload to MinIO failed.');
  }
};

// Export MinIO functions
module.exports = { minioClient,
  uploadToMinIO,
  uploadImageToMinIO };

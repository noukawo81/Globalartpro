import fs from 'fs';
import path from 'path';
let MinioClient = null;
try {
  const mod = await import('minio');
  MinioClient = mod.Client;
} catch (e) {
  console.warn('minio package not available; uploads will use local file fallback');
}

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
const MINIO_PORT = process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000;
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'globalartpro';

let minio = null;
if (MinioClient && MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY) {
  minio = new MinioClient({
    endPoint: MINIO_ENDPOINT,
    port: MINIO_PORT,
    useSSL: MINIO_USE_SSL,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  });
}

export async function ensureBucket() {
  if (!minio) return false;
  try {
    const exists = await minio.bucketExists(MINIO_BUCKET);
    if (!exists) await minio.makeBucket(MINIO_BUCKET);
    return true;
  } catch (e) {
    console.error('minio ensureBucket error', e);
    return false;
  }
}

export async function uploadFile(fileBuffer, destPath, contentType = 'application/octet-stream') {
  // If MinIO configured, upload there, else write to local disk (`data/uploads`)
  if (minio) {
    await ensureBucket();
    const meta = { 'Content-Type': contentType };
    await minio.putObject(MINIO_BUCKET, destPath, fileBuffer, meta);
    // Return public URL - MinIO may be behind a gateway; return a path
    return { url: `minio://${MINIO_BUCKET}/${destPath}` };
  }

  const uploadDir = path.resolve(process.cwd(), 'data', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });
  const outPath = path.join(uploadDir, destPath);
  // ensure nested directories exist for the destination
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, fileBuffer);
  return { url: `file://${outPath}` };
}

export default { uploadFile, ensureBucket };

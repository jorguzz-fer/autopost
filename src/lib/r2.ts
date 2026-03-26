import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "autopost-media";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

export type MediaType = "backgrounds" | "elements" | "images";

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  file: Buffer,
  filename: string,
  mediaType: MediaType,
  contentType: string
): Promise<string> {
  const key = `${mediaType}/${filename}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

/**
 * List all files in a media type folder
 */
export async function listFromR2(mediaType: MediaType): Promise<string[]> {
  const result = await R2.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: `${mediaType}/`,
    })
  );

  if (!result.Contents) return [];

  return result.Contents
    .filter((obj) => obj.Key && !obj.Key.endsWith("/"))
    .map((obj) => `${PUBLIC_URL}/${obj.Key}`);
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(url: string): Promise<void> {
  const key = url.replace(`${PUBLIC_URL}/`, "");

  await R2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

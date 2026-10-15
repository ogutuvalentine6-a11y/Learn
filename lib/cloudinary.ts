import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function generateUploadSignature(params: Record<string, string | number>) {
  const timestamp = Math.round(Date.now() / 1000);
  const toSign = { ...params, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    toSign,
    process.env.CLOUDINARY_API_SECRET as string
  );
  return { signature, ...toSign };
}

export async function deleteAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;

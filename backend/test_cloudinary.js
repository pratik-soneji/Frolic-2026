import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function test() {
  console.log("Config: ", cloudinary.config().cloud_name);
  console.log("Starting upload...");
  try {
    const res = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", {
      folder: "test",
      timeout: 10000 // 10s timeout
    });
    console.log("Upload success:", res.public_id);
  } catch (err) {
    console.error("Upload error:", err);
  }
}

test();

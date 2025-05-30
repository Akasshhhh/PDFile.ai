import AWS from "aws-sdk";
import fs from "fs";
import os from "os"
export async function downloadFromS3(fileKey: string) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      },
      region: "ap-south-1",
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    };
    const obj = await s3.getObject(params).promise();
    // import node:os
    let file_name;
    if (os.platform() === "win32") {
      file_name = `C:\Users\akash\OneDrive\Desktop\PDFiles-${Date.now()}.pdf`;
    } else {
      file_name = `/tmp/pdf-${Date.now()}.pdf`;
    }
    fs.writeFileSync(file_name, obj.Body as Buffer);
    return file_name;
  } catch (error) {
    console.error(error);
    return;
  }
}

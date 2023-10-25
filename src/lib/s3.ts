import AWS from "aws-sdk";


export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      },
      region: "ap-south-1",
    });

    const fileKey =
      "uploads/" + Date.now().toString() + file.name.replace(' ', '-');

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log("uploading.........");
      })
      .promise();

    await upload.then(data => {
      console.log("Successfully uploaded to S3", fileKey);
    });

    return Promise.resolve({
      fileKey,
      file_name: file.name,
    });
  } catch (error) {
    console.error(error);
  }
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${fileKey}`;
  return url;
}

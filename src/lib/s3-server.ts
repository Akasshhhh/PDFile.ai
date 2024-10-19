import AWS from "aws-sdk";
import fs from "fs";
import path from "path"; // Use path module to handle file paths

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

        const folderPath = path.join('C:', 'Users', 'akash', 'OneDrive', 'Desktop', 'PDFiles');
        const fileName = `pdf-${Date.now()}.pdf`; 
        const fullFilePath = path.join(folderPath, fileName);  

        // Ensure the folder exists (optional)
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Write the file to the specified path
        fs.writeFileSync(fullFilePath, obj.Body as Buffer);

        return fullFilePath;
    } catch (error) {
        console.error(error);
        return;
    }
}

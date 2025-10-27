// pages/api/upload.js
import AWS from "aws-sdk";
import sharp from "sharp";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const bucketName = process.env.AWS_BUCKET_NAME;

function uploadToS3(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { file } = req.body;

    const watermarkedImage = await sharp(Buffer.from(file, "base64")).composite([{ input: "public/watermark/logo.png", gravity: "northwest" }]).toBuffer();

    const params = {
      Bucket: bucketName,
      Key: `${Date.now()}.png`,
      Body: watermarkedImage,
      ContentType: "image/png",
    };
    const result = await uploadToS3(params);

    const returResults = {
      c_file: result.Key,
      c_file_url: result.Location,
    };

    res.status(200).json({ results: returResults });


    try {
      //   const data = await s3.upload(params).promise();
      //   res.status(200).json({ url: data.Location });
    } catch (error) {
      res.status(500).json({ error: "Error uploading file" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

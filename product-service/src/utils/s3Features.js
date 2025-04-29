const {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const uuid = require("uuid").v4();

function content_type(extName) {
  if (extName == "jpeg" || extName == "jpg") {
    return "image/jpeg";
  } else if (extName == "mp4") {
    return "video/mp4";
  } else if (extName == "mov") {
    return "video/quicktime";
  } else if ("gif") {
    return "image/gif";
  } else if (extName == "png") {
    return "image/png";
  }
}

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function putObjectURL(ext_name) {
  let key = `${uuid}.${ext_name}`;
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: content_type(ext_name),
  });

  let signedURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { signedURL, key };
}

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

async function deleteObject(key) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  putObjectURL,
  getObjectURL,
  deleteObject,
};

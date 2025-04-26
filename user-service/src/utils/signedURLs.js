const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const uuid = require("uuid").v4();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  const signedURL = await getSignedUrl(s3Client, command);
  return signedURL;
}

const contentType = (extname) => {
  if (extname == "jpg" || extname == "jpeg") {
    return "image/jpeg";
  } else if (extname == "mov") {
    return "video/quicktime";
  } else if (extname == "png") {
    return "image/png";
  } else if (extname == "mp4") {
    return "video/mp4";
  }
};

async function putObjectURL(extensionName) {
  let key = `${uuid}.${extensionName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: contentType(extensionName),
  });

  const signedURL = await getSignedUrl(s3Client, command);

  return { signedURL, key };
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
  getObjectURL,
  putObjectURL,
  deleteObject,
};

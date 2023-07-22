export const aws_local_config = {
  region: "ap-south-1",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
};
export const aws_remote_config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_KEY,
  region: process.env.AWS_REGION,
};

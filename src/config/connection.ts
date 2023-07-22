// import aws from "aws-sdk";
// import dotenv from "dotenv";

// dotenv.config();
// import { aws_remote_config } from "./config.js";
// aws.config.update(aws_remote_config);

// export const dynamoClient = new aws.DynamoDB.DocumentClient();
// export const docClient = new aws.DynamoDB();
// export const s3 = new aws.S3({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.ACCESS_SECRET_KEY,
//   region: process.env.AWS_REGION,
// });

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const region = process.env.AWS_REGION;

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

const s3 = new S3Client({ region });

export { dynamoClient, s3 };

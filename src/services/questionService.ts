import { dynamoClient, s3 } from '../config/connection';
import { v4 as uuidv4 } from 'uuid';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { logger } from '../logger.js';

const TABLE_NAME = 'QuestionAnswer';

// export const getAllQuestions = async () => {
//   const params = {
//     TableName: TABLE_NAME,
//   };
//   const questions = await dynamoClient.scan(params).promise();
//   return questions;
// };

export const getAllQuestions = async (traceId: number) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };
    logger.info(`TraceID:${traceId}, Fetching All Questions from DynamoDB TableName ${TABLE_NAME}`);

    const command = new ScanCommand(params);
    const response = await dynamoClient.send(command);
    const questions = response;

    return questions;
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

// export const getQstnById = async (id) => {
//   const params = {
//     TableName: TABLE_NAME,
//     Key: {
//       questionId: id,
//     },
//   };
//   return await dynamoClient.get(params).promise();
// };

export const getQstnById = async (id: string, traceId: number) => {
  try {
    logger.info(
      `TraceID:${traceId}, Fetching Specific Question from DynamoDB TableName ${TABLE_NAME}`
    );
    const params = {
      TableName: TABLE_NAME,
      Key: {
        questionId: id,
      },
    };

    const command = new GetCommand(params);
    const response = await dynamoClient.send(command);
    const question = response;

    return question;
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

//Api for searching
export const getSrchResult = async (data: string, traceId: number) => {
  try {
    logger.info(`TraceID:${traceId}, Fetching from DynamoDB TableName ${TABLE_NAME}`);

    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'contains(qa, :qa)',
      ExpressionAttributeValues: {
        ':qa': data,
      },
    };

    const command = new ScanCommand(params);
    const response = await dynamoClient.send(command);
    const result = response;

    return result;
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

// export const addOrUpdateQstn = async (question) => {
//   const params = {
//     TableName: TABLE_NAME,
//     Item: question,
//   };
//   return await dynamoClient.put(params).promise();
// };

export const addOrUpdateQstn = async (question: number, traceId: number) => {
  try {
    logger.info(`TraceID:${traceId}, Adding Question To DynamoDB TableName:${TABLE_NAME}`);
    const params: any = {
      TableName: TABLE_NAME,
      Item: question,
    };

    const command = new PutCommand(params);
    return await dynamoClient.send(command);
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

// export const updateQstn = async (question, imageLocation) => {
//   // console.log("question",question);
//   // console.log("imageLoc",imageLocation);
//   //console.log("last imageloc", question.secondary[0].imgdata);
//   const params = {
//     TableName: TABLE_NAME,
//     Key: {
//       questionId: question.id,
//     },
//     UpdateExpression:
//       "set question = :q, answer = :a, qa = :qa, dateLog = :dt,secondary=:sc,imageLocation = :imgl,createdBy=:cb,authorRole=:ar",
//     ExpressionAttributeValues: {
//       ":q": question.question,
//       ":a": question.answer,
//       ":qa":
//         question.question.toLowerCase() + " " + question.answer.toLowerCase(),
//       ":dt": question.dateLog,
//       ":sc": question.secondary,
//       ":imgl": [...imageLocation, ...question.imgLocation],
//       ":cb": question.createdBy,
//       ":ar": question.authorRole,
//     },
//   };
//   return await dynamoClient.update(params).promise();
// };

export const updateQstn = async (question: any, imageLocation: string[], traceId: number) => {
  try {
    logger.info(`TraceID:${traceId}, Updating Qestion to DynamoDB TableName:${TABLE_NAME}`);
    const params = {
      TableName: TABLE_NAME,
      Key: {
        questionId: question.id,
      },
      UpdateExpression:
        'SET question = :q, answer = :a, qa = :qa, dateLog = :dt, secondary = :sc, imageLocation = :imgl, createdBy = :cb, authorRole = :ar',
      ExpressionAttributeValues: {
        ':q': question.question,
        ':a': question.answer,
        ':qa': question.question.toLowerCase() + ' ' + question.answer.toLowerCase(),
        ':dt': question.dateLog,
        ':sc': question.secondary,
        ':imgl': [...imageLocation, ...question.imgLocation],
        ':cb': question.createdBy,
        ':ar': question.authorRole,
      },
    };

    const command = new UpdateCommand(params);
    return await dynamoClient.send(command);
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

// export const deleteQstn = async (id) => {
//   const params = {
//     TableName: TABLE_NAME,
//     Key: {
//       questionId: id,
//     },
//   };
//   console.log("first");
//   return await dynamoClient.delete(params).promise();
// };

export const deleteQstn = async (id: string, traceId: number) => {
  try {
    logger.info(
      `TraceID:${traceId}, Deleting QuestionID:${id} from DynamoDB TableName:${TABLE_NAME}`
    );
    const params = {
      TableName: TABLE_NAME,
      Key: {
        questionId: id,
      },
    };

    const command = new DeleteCommand(params);
    return await dynamoClient.send(command);
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

// export const deleteS3Object = async (objectKey) => {
//   try {
//     var params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: objectKey,
//     };
//     s3.deleteObject(params, function (err, data) {
//       if (err) console.log(err, err.stack); // an error occurred
//       else console.log(data); // successful response
//     });
//   } catch (error) {
//     console.error("Error deleting object:", error);
//   }
// };

export const deleteS3Object = async (objectKey: string, traceId: number) => {
  try {
    logger.info(`TraceID:${traceId}, Deleting from s3Bucket ${process.env.AWS_BUCKET_NAME}`);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectKey,
    };

    const command = new DeleteObjectCommand(params);
    const response = await s3.send(command);
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

// export const uploadImage = (file, id) => {
//   const uniqueId = uuidv4();

//   return new Promise((resolve, reject) => {
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: uniqueId + file.originalname,
//       Body: file.buffer,
//       ContentType: file.type,
//     };

//     s3.upload(params, async (error, data) => {
//       if (error) {
//         console.log(error);
//         reject(error);
//       } else {
//         const params = {
//           TableName: "QuestionAnswer",
//           Key: {
//             questionId: id,
//           },
//           UpdateExpression:
//             "SET #listAttr = list_append(#listAttr, :newString), #anotherAttr = list_append(#anotherAttr, :newData)",
//           ExpressionAttributeNames: {
//             "#listAttr": "imageLocation",
//             "#anotherAttr": "s3Keys",
//           },
//           ExpressionAttributeValues: {
//             ":newString": [data.Location],
//             ":newData": [uniqueId + file.originalname],
//           },
//         };

//         dynamoClient.update(params, function (err, data) {
//           if (err) {
//             console.log("thissssss");
//             // console.log("Error:", err);
//             reject(err);
//           } else {
//             console.log("Item updated successfully:", data);
//             resolve(data);
//           }
//         });
//       }
//     });
//   });
// };

export const uploadImage = async (file: any, id: string, traceId: number) => {
  const uniqueId = uuidv4();

  try {
    logger.info(`TraceID:${traceId}, Uploading Image to s3Bucket ${process.env.AWS_BUCKET_NAME}`);
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueId + file.originalname,
      Body: file.buffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    const response = await s3.send(command);

    const updateParams = {
      TableName: 'QuestionAnswer',
      Key: {
        questionId: id,
      },
      UpdateExpression:
        'SET #listAttr = list_append(#listAttr, :newString), #anotherAttr = list_append(#anotherAttr, :newData)',
      ExpressionAttributeNames: {
        '#listAttr': 'imageLocation',
        '#anotherAttr': 's3Keys',
      },
      ExpressionAttributeValues: {
        ':newString': [
          `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`,
        ],
        ':newData': [uniqueId + file.originalname],
      },
    };

    const updateCommand = new UpdateCommand(updateParams);
    const updateResponse = await dynamoClient.send(updateCommand);

    logger.info(`TraceID:${traceId}, Uploaded Image Successfully`);

    return updateResponse;
  } catch (error) {
    logger.error(`TraceID:${traceId}, Error:${error}`);
  }
};

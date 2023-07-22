import { dynamoClient } from '../config/connection';

const TABLE_NAME = 'UsersInfo';

import {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

export const getUsrs = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const command = new ScanCommand(params);
  const response = await dynamoClient.send(command);
  const questions = response;

  return questions;
};

export const getUsrById = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };

  const command = new GetCommand(params);
  const response = await dynamoClient.send(command);
  const usr = response;

  return usr;
};

export const lgin = async (data) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: data.id,
    },
  };

  const command = new GetCommand(params);
  const response = await dynamoClient.send(command);
  const usr = response;

  return usr;
};

export const addUsr = async (userinfo: any) => {
  console.log(userinfo.id);
  const params = {
    TableName: TABLE_NAME,
    Item: userinfo,
    ConditionExpression: 'attribute_not_exists(id)',
  };

  const command = new PutCommand(params);
  return await dynamoClient.send(command);
};

export const updateUsr = async (user: any) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: user.id,
    },
    UpdateExpression: 'set rolePosition = :rolePosition',
    ExpressionAttributeValues: {
      ':rolePosition': user.rolePosition,
    },
  };

  const command = new UpdateCommand(params);
  return await dynamoClient.send(command);
};

export const deleteUsr = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };

  const command = new DeleteCommand(params);
  return await dynamoClient.send(command);
};

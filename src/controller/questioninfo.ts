import {
  getAllQuestions,
  getQstnById,
  getSrchResult,
  addOrUpdateQstn,
  updateQstn,
  deleteQstn,
} from '../services/questionService';

export const getQuestions = async (traceId: number) => {
  const questions = getAllQuestions(traceId);
  return questions;
};

export const getQuestionById = async (id: string, traceId: number) => {
  const question = getQstnById(id, traceId);
  return question;
};

//Api for searching
export const getSearchResult = async (data: string, traceId: number) => {
  const question = getSrchResult(data, traceId);
  return question;
};

export const addOrUpdateQuestion = async (question, traceId: number) => {
  const qstn = addOrUpdateQstn(question, traceId);
  return qstn;
};

export const updateQuestion = async (question, imageLocation, traceId: number) => {
  const qstn = updateQstn(question, imageLocation, traceId);
  return qstn;
};

export const deleteQuestion = async (id: string, traceId: number) => {
  const qstn = deleteQstn(id, traceId);
  return qstn;
};

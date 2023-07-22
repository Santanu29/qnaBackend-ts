import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger';

const router = Router();

import {
  addOrUpdateQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionById,
  getSearchResult,
  updateQuestion,
} from '../controller/questioninfo.js';
import { deleteS3Object, uploadImage } from '../services/questionService';
import { upload } from '../utils/imageStorage';
import { HttpRequest } from '@aws-sdk/types';

// Gneertae 6 Digit Random number
function get6DigitRandomNumber(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

router.get('/questions', async (req, res) => {
  const traceId: number = get6DigitRandomNumber();
  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    const questions = await getQuestions(traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ traceId, questions }); // Include traceId in the response
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

router.get('/questions/:id', async (req, res) => {
  const id = req.params.id;
  const traceId: number = get6DigitRandomNumber();

  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    const question = await getQuestionById(id, traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ traceId, question });
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

router.get('/questionsans/:data', async (req, res) => {
  const data = req.params.data;
  const traceId: number = get6DigitRandomNumber();

  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    const question = await getSearchResult(data, traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ traceId, question });
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

router.post('/questions', upload, async (req, res) => {
  const { question, answer, status, dateLog, secondary, createdBy, authorRole } = JSON.parse(
    req.body.data
  );

  const traceId: number = get6DigitRandomNumber();

  logger.info(`TraceID:${traceId},<------StartingPoint------>`);
  logger.info(`TraceID:${traceId}, Data Incoming:${JSON.stringify(JSON.parse(req.body.data))}`);

  try {
    let imageLocation: string[] = [];
    let s3Keys: string[] = [];
    let id = uuidv4();
    const qa = question.toLowerCase() + ' ' + answer.toLowerCase();
    const qnavalue = {
      question: question,
      answer: answer,
      questionId: id,
      createdBy: createdBy,
      authorRole: authorRole,
      qa: qa,
      status: status,
      dateLog: dateLog,
      secondary: secondary,
      imageLocation: imageLocation,
      s3Keys: s3Keys,
    };

    const newQuestion = addOrUpdateQuestion(qnavalue, traceId);

    if (req?.files) {
      const uploadPromises = Promise.all(
        req.files.map(async (file: any) => {
          try {
            await uploadImage(file, id, traceId);
          } catch (error) {
            logger.error(`TraceID:${traceId}, Error:${error}`);
          }
        })
      );

      await uploadPromises;
      logger.info(`TraceID:${traceId},<------EndPoint------>`);
      res.json(traceId);
    }
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

router.put('/questions/:id', upload, async (req, res) => {
  const question = JSON.parse(req.body.data);
  let imageLocation: string[] = [];
  const { id } = req.params;
  question.id = id;
  const traceId: number = get6DigitRandomNumber();
  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    logger.info(`TraceID:${traceId}, Data Incoming:${JSON.stringify(JSON.parse(req.body.data))}`);
    const newQuestion = await updateQuestion(question, imageLocation, traceId);

    if (req?.files) {
      const uploadPromises = Promise.all(
        req.files.map(async (file: any) => {
          try {
            await uploadImage(file, id, traceId);
          } catch (error) {
            logger.error(`TraceID:${traceId}, Error:${error}`);
          }
        })
      );

      await uploadPromises;
      logger.info(`TraceID:${traceId},<------EndPoint------>`);
      res.json(traceId);
    }
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

router.delete('/questions/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.body.s3keys);
  const { s3keys } = req.body;
  const traceId: number = get6DigitRandomNumber();

  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    s3keys.map(async (key: string) => {
      await deleteS3Object(key, traceId);
    });
    await deleteQuestion(id, traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ message: 'Question deleted successfully', traceId: traceId });
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: 'Something went wrong' });
  }
});

export default router;

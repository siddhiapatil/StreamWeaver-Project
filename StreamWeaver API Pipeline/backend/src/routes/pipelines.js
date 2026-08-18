import { Router } from 'express';
import mongoose from 'mongoose';
import { Pipeline } from '../models/Pipeline.js';
import { validatePipelinePayload } from '../utils/validation.js';
import { AppError } from '../utils/AppError.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Mongo's duplicate-key error for our (owner, name) unique index.
const isDuplicateNameError = (error) => error?.code === 11000;

/**
 * Pipeline configuration API. Mounted at /api/pipelines behind the
 * `authenticate` middleware, so every handler here can rely on req.user.sub
 * being the current user's id. Every query is scoped to `owner: req.user.sub`
 * so one user can never read, edit, or delete another user's pipelines.
 */
export function pipelineRouter() {
  const router = Router();

  // GET /api/pipelines - list the current user's saved pipeline configs
  router.get('/', async (req, res, next) => {
    try {
      const pipelines = await Pipeline.find({ owner: req.user.sub }).sort({ updatedAt: -1 });
      res.json({ pipelines });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/pipelines/:id - load a single saved pipeline config
  router.get('/:id', async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id)) throw new AppError('Invalid pipeline id.', 400);
      const pipeline = await Pipeline.findOne({ _id: req.params.id, owner: req.user.sub });
      if (!pipeline) throw new AppError('Pipeline not found.', 404);
      res.json({ pipeline });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/pipelines - save a new pipeline config
  router.post('/', async (req, res, next) => {
    try {
      const payload = validatePipelinePayload(req.body);
      const pipeline = await Pipeline.create({ ...payload, owner: req.user.sub });
      res.status(201).json({ pipeline });
    } catch (error) {
      if (isDuplicateNameError(error)) return next(new AppError('You already have a pipeline with this name.', 409));
      next(error);
    }
  });

  // PUT /api/pipelines/:id - update (re-save) an existing pipeline config
  router.put('/:id', async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id)) throw new AppError('Invalid pipeline id.', 400);
      const payload = validatePipelinePayload(req.body);
      const pipeline = await Pipeline.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.sub },
        payload,
        { new: true, runValidators: true }
      );
      if (!pipeline) throw new AppError('Pipeline not found.', 404);
      res.json({ pipeline });
    } catch (error) {
      if (isDuplicateNameError(error)) return next(new AppError('You already have a pipeline with this name.', 409));
      next(error);
    }
  });

  // DELETE /api/pipelines/:id - remove a saved pipeline config
  router.delete('/:id', async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id)) throw new AppError('Invalid pipeline id.', 400);
      const pipeline = await Pipeline.findOneAndDelete({ _id: req.params.id, owner: req.user.sub });
      if (!pipeline) throw new AppError('Pipeline not found.', 404);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

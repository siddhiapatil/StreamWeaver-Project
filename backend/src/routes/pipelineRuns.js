import { Router } from 'express';
import { pipelineRunController } from '../controllers/pipelineRun.controller.js';
export function pipelineRunRouter({ executePipeline, logger }) { const router = Router(); const controller = pipelineRunController({ executePipeline, logger }); router.post('/:id/run', controller.run); router.get('/:id/runs/:runId', controller.getStatus); return router; }

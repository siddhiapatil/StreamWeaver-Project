import mongoose from 'mongoose';
import { PIPELINE_RUN_STATUS } from '../config/constants.js';

const pipelineRunSchema = new mongoose.Schema(
    {
        pipelineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pipeline',
            required: true
        },
        sourceJobId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(PIPELINE_RUN_STATUS),
            default: PIPELINE_RUN_STATUS.PENDING
        },
        processed: {
            type: Number,
            default: 0
        },
        inserted: {
            type: Number,
            default: 0
        },
        startedAt: Date,
        completedAt: Date,
        error: {
            code: String,
            message: String,
            details: mongoose.Schema.Types.Mixed
        },
        logs: [
            {
                timestamp: Date,
                level: String,
                message: String,
                data: mongoose.Schema.Types.Mixed
            }
        ]
    },
    { timestamps: true }
);

export const PipelineRun = mongoose.model('PipelineRun', pipelineRunSchema);

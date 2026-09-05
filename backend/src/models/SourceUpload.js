import mongoose from 'mongoose';

const sourceUploadSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        filepath: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        mimeType: {
            type: String,
            default: 'text/csv'
        },
        status: {
            type: String,
            enum: ['uploaded', 'processing', 'completed', 'failed'],
            default: 'uploaded'
        }
    },
    { timestamps: true }
);

export const SourceUpload = mongoose.model('SourceUpload', sourceUploadSchema);

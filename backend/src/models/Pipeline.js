import mongoose from 'mongoose';

const pipelineSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },
        description: {
            type: String,
            default: '',
            maxlength: 1000
        },
        mappings: [
            {
                source: String,
                destination: String,
                transform: String
            }
        ],
        batchSize: {
            type: Number,
            default: 1000,
            min: 100,
            max: 10000
        },
        source: {
            type: String,
            enum: ['csv-upload'],
            default: 'csv-upload'
        },
        destination: {
            type: String,
            enum: ['mongodb'],
            default: 'mongodb'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export const Pipeline = mongoose.model('Pipeline', pipelineSchema);

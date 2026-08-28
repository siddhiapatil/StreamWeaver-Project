import mongoose from 'mongoose';

const mappingSchema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  transform: { type: String, trim: true, default: '' }
}, { _id: false });

const pipelineSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  mappings: {
    type: [mappingSchema],
    required: true,
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'A pipeline needs at least one column mapping.'
    }
  },
  batchSize: { type: Number, default: 1000, min: 1, max: 10000 }
}, { timestamps: true });

// One pipeline name per owner. The route layer also checks this up front
// and turns a duplicate-key error into a 409, so this is a safety net
// against races rather than the primary validation path.
pipelineSchema.index({ owner: 1, name: 1 }, { unique: true });

export const Pipeline = mongoose.model('Pipeline', pipelineSchema);

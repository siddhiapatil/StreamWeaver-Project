import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Pipeline } from '../src/models/Pipeline.js';

// These are HTTP integration tests: they run the real Express app in-memory
// (via supertest, no listening port needed) against a real MongoDB. Point
// TEST_MONGODB_URI at a scratch database, or just have MongoDB running
// locally on the default port - if neither is reachable, the whole suite
// skips instead of failing, so `npm test` still works without Mongo set up.
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/streamweaver_test';

const env = {
  jwtSecret: 'test-only-secret-do-not-use-in-production',
  clientOrigin: 'http://localhost:5173',
  uploadDir: 'test-uploads'
};

// A stub Socket.IO instance - the ETL router emits progress on it, but
// nothing here exercises that path, so a no-op emit is enough.
const io = { emit: () => {} };

let app;
let mongoAvailable = true;

test.before(async () => {
  try {
    await mongoose.connect(TEST_MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    app = createApp(env, io);
  } catch {
    mongoAvailable = false;
  }
});

test.after(async () => {
  if (!mongoAvailable) return;
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test('pipeline configuration API', async (t) => {
  if (!mongoAvailable) {
    t.skip(`No MongoDB reachable at ${TEST_MONGODB_URI} - start MongoDB locally to run this suite.`);
    return;
  }

  await User.deleteMany({});
  await Pipeline.deleteMany({});

  await t.test('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/pipelines');
    assert.equal(res.status, 401);
  });

  const register = await request(app).post('/api/auth/register').send({
    name: 'Pipeline Tester',
    email: 'pipeline-tester@example.com',
    password: 'strong-password'
  });
  assert.equal(register.status, 201);
  const token = register.body.token;

  await t.test('rejects an invalid pipeline payload with a 400', async () => {
    const res = await request(app)
      .post('/api/pipelines')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  let pipelineId;
  await t.test('saves a new pipeline configuration', async () => {
    const res = await request(app)
      .post('/api/pipelines')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Customer import',
        description: 'Maps raw customer export columns',
        mappings: [
          { source: 'first_name', destination: 'firstName' },
          { source: 'email_addr', destination: 'email', transform: 'value => value.toLowerCase()' }
        ]
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.pipeline.name, 'Customer import');
    assert.equal(res.body.pipeline.mappings.length, 2);
    pipelineId = res.body.pipeline._id;
  });

  await t.test('lists saved pipelines for the owner', async () => {
    const res = await request(app).get('/api/pipelines').set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.pipelines.length, 1);
  });

  await t.test('loads a single saved pipeline configuration', async () => {
    const res = await request(app).get(`/api/pipelines/${pipelineId}`).set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.pipeline._id, pipelineId);
  });

  await t.test('rejects a duplicate pipeline name for the same user with a 409', async () => {
    const res = await request(app)
      .post('/api/pipelines')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Customer import', mappings: [{ source: 'a', destination: 'b' }] });
    assert.equal(res.status, 409);
  });

  await t.test('updates an existing pipeline configuration', async () => {
    const res = await request(app)
      .put(`/api/pipelines/${pipelineId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Customer import v2', mappings: [{ source: 'a', destination: 'b' }] });
    assert.equal(res.status, 200);
    assert.equal(res.body.pipeline.name, 'Customer import v2');
  });

  await t.test('a second user cannot see or load the first user\'s pipeline', async () => {
    const secondUser = await request(app).post('/api/auth/register').send({
      name: 'Second User',
      email: 'second-user@example.com',
      password: 'another-strong-password'
    });
    const secondToken = secondUser.body.token;

    const list = await request(app).get('/api/pipelines').set('Authorization', `Bearer ${secondToken}`);
    assert.equal(list.status, 200);
    assert.equal(list.body.pipelines.length, 0);

    const load = await request(app).get(`/api/pipelines/${pipelineId}`).set('Authorization', `Bearer ${secondToken}`);
    assert.equal(load.status, 404);
  });

  await t.test('deletes a saved pipeline configuration', async () => {
    const res = await request(app).delete(`/api/pipelines/${pipelineId}`).set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 204);

    const followUp = await request(app).get(`/api/pipelines/${pipelineId}`).set('Authorization', `Bearer ${token}`);
    assert.equal(followUp.status, 404);
  });
});

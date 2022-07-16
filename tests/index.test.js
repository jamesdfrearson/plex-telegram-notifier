const request = require('supertest');
const server = require('../src/index');
require('dotenv').config();

describe('GET /', () => {
  it('Should return a basic message.', async () => {
    const res = await request(server.server).get('/').send({});
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('Connected successfully.');
    expect(typeof res.body.telegram).toEqual('object');
  });
});

describe('POST /', () => {
  it('Return an error message when no payload is passed.', async () => {
    const res = await request(server.server).post('/').send({});
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual('No payload data.');
  });
});

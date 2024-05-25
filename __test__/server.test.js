const request  = require("supertest");
const app = require("../src/server/index"); // Link to your server file

describe('Test GET /', () => {
    test('test that endpoint responds with status code 200', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});
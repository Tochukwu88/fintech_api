const request = require('supertest');

const  app  = require('./app');

let token;
//login
beforeAll((done) => {
  request(app)
    .post('/auth/login')
    .send({
      email: "test3@test.com",
      password: "123456",
    })
    .end((err, response) => {
      token = response.body.data.token; 
      done();
    });
});
// testing register
describe('POST /auth/register', () => {
  describe('given  name,email,password', () => {
    test('should respond with a status code of 201', async () => {
      const response = await request(app).post('/auth/register').send({
        firstName:"test4445",
        lastName:"testlast3454",
        email:"okeson@test.com",
        password:"123456"
      });
      expect(response.statusCode).toBe(201);
    });
  });
  describe('missing either name,email,password', () => {
    test('should respond with a status code of 422', async () => {
      const resp = await request(app).post('/auth/register').send({
        firstName:"test4545",
        lastName:"testlast4",
        email:"test458@test.com"
      });
      expect(resp.statusCode).toBe(422);
    });
  });
});
//testing transfer to beneficiary
describe('POST /user/transfer', () => {
 
    describe('given  amount,email,description', () => {
      test('should respond with a status code of 200', async () => {
        const response = await request(app).post('/user/transfer').send({
            email:"test@test.com",
            amount:"5000",
            description:"montly expenses"
        })
        .set('Authorization', 'Bearer ' + token);
        expect(response.statusCode).toBe(200);
      });
    });
   
  });
  //testing add beneficiary
  describe('POST /user/add', () => {
          describe('given  email', () => {
        test('should respond with a status code of 200', async () => {
          const response = await request(app).post('/user/add').send({
              email:"test4867@test.com",
             
          })
          .set('Authorization', 'Bearer ' + token);
          expect(response.statusCode).toBe(200);
        });
      });
     
    });
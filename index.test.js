const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });
    describe('POST /dogs', () => {
        it('should create a new dog', async () => {
            // make a request
            const response = await request(app).post('/dogs').send(testDogData);
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // expect the response to be the same as the testDogData
            expect(response.body).toEqual(expect.objectContaining(testDogData));
        });
    });
    describe('DELETE /dogs/:id', () => {
        it('should delete a dog by id', async () => {
            // get the first dog from the db
            const dog = await Dog.findByPk(1);
            // make a request
            const response = await request(app).delete(`/dogs/${dog.id}`);
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // expect an empty object to be returned
            expect(response.body).toEqual({});
        });
    });
});
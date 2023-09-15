const req = require('supertest');
const httpServer = require('../src/app');

describe('Post Grocery Item: POST /api/grocery-add', () => {
  const groceryItem = {
    item: 'jello',
    quantity: 23,
    price: 5,
    bought: false,
  };
  // Clear the item added in test
  afterAll(async () => {
    await req(httpServer).delete(`/?item=${groceryItem.item}`);
  });

  test('Post new grocery item', async () => {
    const res = await req(httpServer)
      .post('/api/grocery-add')
      .send(groceryItem);

    expect(res.statusCode).toBe(201);
  });

  test('Post should have included one item in grocery list', async () => {
    const res = await req(httpServer).get('/api/grocery-list');
    expect(res.body.length).toBe(1);
  });
});

describe('Get All Grocery Item: GET /api/grocery-list', () => {
  test('Should get an empty list', async () => {
    const res = await req(httpServer).get('/api/grocery-list');
    expect(res.statusCode).toBe(200);
    console.log(res.body);
  });
});

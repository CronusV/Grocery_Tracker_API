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

describe('Delete a grocery item: DELETE /?item=<item_to_delete>', () => {
  const groceryItem = {
    item: 'jello',
    quantity: 23,
    price: 5,
    bought: false,
  };

  test('Add an item and delete it', async () => {
    // Add item
    await req(httpServer).post('/api/grocery-add').send(groceryItem);
    // Make sure 1 item in list
    let res = await req(httpServer).get('/api/grocery-list');
    expect(res.body.length).toBe(1);
    // Delete item
    await req(httpServer).delete(`/?item=${groceryItem.item}`);
    // Check to make sure its deleted
    res = await req(httpServer).get('/api/grocery-list');
    expect(res.body.length).toBe(0);
  });

  test('Delete an item that does not exist', async () => {
    const res = await req(httpServer).delete(`/?item=NOTEXIST`);
    expect(res.statusCode).toBe(404);
  });

  test('Delete an item with no name', async () => {
    const res = await req(httpServer).delete('');
    expect(res.statusCode).toBe(404);
  });
});

describe('Put a grocery item: PUT /api/grocery-edit', () => {
  const groceryItem = {
    item: 'jello',
    quantity: 23,
    price: 5,
    bought: false,
  };
  beforeAll(async () => {
    await req(httpServer).post('/api/grocery-add').send(groceryItem);
  });
  afterAll(async () => {
    await req(httpServer).delete(`/?item=${groceryItem.item}`);
  });
  test('Change a grocery item in list', async () => {
    const newItem = {
      item: 'jello',
      quantity: 54,
      price: 5333,
      bought: true,
    };
    let res = await req(httpServer).put('/api/grocery-edit').send(newItem);
    expect(res.statusCode).toBe(200);
    res = await req(httpServer).get('/api/grocery-list');
    const parsedItem = res.body[0];

    expect(() => {
      if (
        parsedItem.item === newItem.item &&
        parsedItem.quantity === newItem.quantity &&
        parsedItem.price === newItem.price &&
        parsedItem.bought == newItem.bought
      ) {
        return true;
      } else {
        return false;
      }
    }).toBeTruthy();
  });

  test('Change grocery item that doesnt exist', async () => {
    const newItem = {
      item: 'DOESNOTEXIST',
    };
    let res = await req(httpServer).put('/api/grocery-edit').send(newItem);
  });
});

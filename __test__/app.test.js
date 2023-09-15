const { exceptions } = require('winston');
const {
  groceryList,
  editGrocery,
  deleteItemInGrocery,
  getReturn,
  pushGroceryList,
} = require('../src/app');

describe('Get all items in the groceryList', () => {
  beforeAll(() => {
    groceryList.splice(0, groceryList.length);
  });

  afterAll(() => {
    groceryList.splice(0, groceryList.length);
  });

  test('Make sure groceryList is empty', () => {
    expect(groceryList.length).toBe(0);
  });

  test('Make sure getReturn returns : "[]"', () => {
    expect(getReturn(groceryList)).toBe('[]');
  });
});

describe('Posting data to groceryList', () => {
  beforeAll(() => {
    groceryList.splice(0, groceryList.length);
  });

  afterAll(() => {
    groceryList.splice(0, groceryList.length);
  });

  test('Make sure item is being pushed to grocery list (POST)', () => {
    const groceryItem = {
      item: 'jello',
      quantity: 23,
      price: 5,
      bought: false,
    };

    pushGroceryList(groceryItem);
    expect(groceryList.length).toBe(1);

    expect(() => {
      // Pushed item should be the first one in the groceryList
      const itemInGroceryList = groceryList[0];
      if (
        itemInGroceryList.item === groceryItem.item &&
        itemInGroceryList.quantity === groceryItem.quantity &&
        itemInGroceryList.price === groceryItem.price &&
        itemInGroceryList.bought == groceryItem.bought
      ) {
        return true;
      } else {
        return false;
      }
    }).toBeTruthy();
  });
});

describe('Edit data into groceryList (PUT)', () => {
  const groceryItem = {
    item: 'jello',
    quantity: 23,
    price: 5,
    bought: false,
  };
  beforeAll(() => {
    groceryList.splice(0, groceryList.length);
  });

  afterAll(() => {
    groceryList.splice(0, groceryList.length);
  });

  beforeEach(() => {
    pushGroceryList(groceryItem);
  });

  afterEach(() => {
    groceryList.splice(0, groceryList.length);
  });

  test('Edit known item', () => {
    const newItem = {
      item: 'jello',
      quantity: 54,
      price: 5333,
      bought: true,
    };

    expect(editGrocery(newItem)).toBeTruthy();
    expect(() => {
      if (
        newItem.item === groceryList[0].item &&
        newItem.quantity === groceryList[0].quantity &&
        newItem.price === groceryList[0].price &&
        newItem.bought == groceryList[0].bought
      ) {
        return truel;
      } else {
        false;
      }
    }).toBeTruthy();
  });
});

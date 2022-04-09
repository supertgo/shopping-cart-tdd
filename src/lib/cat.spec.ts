import Cart, { Item } from './cart';

describe('Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
  });

  it('should return 0 when getTotal() is executed in a newly created instance', () => {
    const cart = new Cart();

    expect(cart.getTotal()).toBe(0);
  });

  it('should multiply quantity and price and receive total amount', () => {
    const item: Item = {
      product: {
        title: 'Addidas running shoes - men',
        price: 35388
      },
      quantity: 2
    };

    cart.add(item);

    expect(cart.getTotal()).toBe(item.product.price * 2);
  });
});

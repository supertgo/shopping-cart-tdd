import Cart, { Item } from './cart';

describe('Cart', () => {
  let cart: Cart;
  const product = {
    title: 'Addidas running shoes - men',
    price: 35388
  };

  const product2 = {
    title: 'Addidas running shoes - women',
    price: 41872
  };

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      const cart = new Cart();

      expect(cart.getTotal()).toBe(0);
    });

    it('should multiply quantity and price and receive total amount', () => {
      const item: Item = {
        product,
        quantity: 2
      };

      cart.add(item);

      expect(cart.getTotal()).toBe(item.product.price * 2);
    });

    it('should ensure no more than on product exists at a time', () => {
      cart.add({
        product,
        quantity: 2
      });

      cart.add({
        product,
        quantity: 1
      });

      expect(cart.getTotal()).toBe(35388);
    });

    it('should update total when a product get included and then removed', () => {
      cart.add({
        product,
        quantity: 2
      });

      cart.add({
        product: product2,
        quantity: 1
      });

      expect(cart.getTotal()).toBe(35388 * 2 + 41872);

      cart.remove(product);

      expect(cart.getTotal()).toBe(41872);
    });
  });
});

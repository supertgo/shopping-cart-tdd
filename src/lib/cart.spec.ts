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

  describe('checkout()', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2
      });

      cart.add({
        product: product2,
        quantity: 3
      });

      expect(cart.checkout()).toMatchSnapshot();
    });

    it('should return an object with the items when summary is called', () => {
      cart.add({
        product,
        quantity: 2
      });

      cart.add({
        product: product2,
        quantity: 3
      });

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal()).toBeGreaterThan(0);
    });

    it('should reset the cart when chekcout() is called', () => {
      cart.add({
        product: product2,
        quantity: 3
      });

      cart.checkout();

      expect(cart.getTotal()).toBe(0);
    });

    it('should reset the cart when clear() is called', () => {
      cart.add({
        product,
        quantity: 2
      });

      cart.add({
        product: product2,
        quantity: 3
      });

      cart.add({
        product,
        quantity: 2
      });

      cart.add({
        product: product2,
        quantity: 3
      });

      cart.clear();

      expect(cart.items).toStrictEqual([]);
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2
      };

      cart.add({
        product,
        condition,
        quantity: 3
      });

      expect(cart.getTotal()).toEqual(74315);
    });
  });
});

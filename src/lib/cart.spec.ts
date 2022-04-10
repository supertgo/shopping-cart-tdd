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

    it('should include formatted amount in the summary', () => {
      cart.add({
        product,
        quantity: 2
      });

      cart.add({
        product: product2,
        quantity: 3
      });

      expect(cart.summary().formatted).toBe('R$ 196.392,00');
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

    it('should not apply percentage discount when quantity is below or equal minimum', () => {
      const condition = {
        percentage: 30,
        minimum: 2
      };

      cart.add({
        product,
        condition,
        quantity: 1
      });

      expect(cart.getTotal()).toEqual(product.price);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2
      };

      cart.add({
        product,
        condition,
        quantity: 4
      });

      expect(cart.getTotal()).toEqual(70776);
    });

    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2
      };

      cart.add({
        product,
        condition,
        quantity: 5
      });

      expect(cart.getTotal()).toEqual(106164);
    });

    it('should not apply quantity discount when quantity is below or equal minimum', () => {
      const condition = {
        quantity: 2
      };

      cart.add({
        product,
        condition,
        quantity: 2
      });
      expect(cart.getTotal()).toEqual(product.price * 2);
    });

    it('First case: should receive two or more conditions and determine/apply the best one', () => {
      const condition1 = {
        percentage: 30, //30%
        minimum: 2
      };

      const condition2 = {
        quantity: 2 //40%
      };

      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5
      });

      expect(cart.getTotal()).toEqual(product.price * 5 * 0.6);
    });

    it('Second case: should receive two or more conditions and determine/apply the best one', () => {
      const condition1 = {
        percentage: 60, //30%
        minimum: 2
      };

      const condition2 = {
        quantity: 2 //40%
      };

      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5
      });

      expect(cart.getTotal()).toEqual(product.price * 5 * 0.4);
    });
  });
});

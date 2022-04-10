import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

type Product = {
  title: string;
  price: number;
};

type Condition = {
  quantity?: number;
  percentage?: number;
  minimum?: number;
};

export type Item = {
  product: Product;
  condition?: Condition | Condition[];
  quantity: number;
};

type Summary = {
  total: number;
  items: Item[];
};

type CalculateDiscountFunctions = {
  product: Product;
  condition?: Condition;
  quantity: number;
};

const calculatePercentageDiscount = (
  amount: Money.Dinero,
  item: CalculateDiscountFunctions
) => {
  if (item.condition?.percentage && item.quantity > item.condition.minimum) {
    return amount.percentage(item.condition.percentage);
  }

  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (
  amount: Money.Dinero,
  item: CalculateDiscountFunctions
) => {
  const isEven = item.quantity % 2 === 0;

  if (item.condition?.quantity && item.quantity > item.condition?.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }

  return Money({ amount: 0 });
};

const calculateDiscount = (
  amount: Money.Dinero,
  quantity: number,
  condition: Condition | Condition[],
  item: Product
) => {
  const list = Array.isArray(condition) ? condition : [condition];

  const [higherDiscount] = list
    .map((cond) => {
      if (cond.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: cond,
          quantity,
          product: item
        }).getAmount();
      } else if (cond.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: cond,
          quantity,
          product: item
        }).getAmount();
      }
    })
    .sort((a, b) => {
      return b - a;
    });

  return Money({ amount: higherDiscount });
};

export default class Cart {
  items: Item[] = [];

  add(item: Item) {
    const itemToFind = { product: item.product };

    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind);
    }

    this.items.push(item);
  }

  getTotal() {
    const total = this.items.reduce((accumulator, currentItem) => {
      const amount = Money({
        amount: currentItem.quantity * currentItem.product.price
      });
      let discount = Money({ amount: 0 });

      if (currentItem.condition) {
        discount = calculateDiscount(
          amount,
          currentItem.quantity,
          currentItem.condition,
          currentItem.product
        );
      }

      return accumulator.add(amount).subtract(discount);
    }, Money({ amount: 0 }));

    return total.getAmount();
  }

  remove(product: Product) {
    remove(this.items, { product });
  }

  clear() {
    this.items = [];
  }

  summary(): Summary {
    const total = this.getTotal();
    const items = this.items;

    return {
      total,
      items
    };
  }

  checkout() {
    const { total, items } = this.summary();

    this.clear();

    return {
      total,
      items
    };
  }
}

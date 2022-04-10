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
  formatted: string;
};

type CalculateDiscountFunctions = {
  condition?: Condition;
  quantity: number;
};

const calculatePercentageDiscount = (
  amount: Money.Dinero,
  { condition, quantity }: CalculateDiscountFunctions
) => {
  if (condition?.percentage && quantity > condition.minimum) {
    return amount.percentage(condition.percentage);
  }

  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (
  amount: Money.Dinero,
  { condition, quantity }: CalculateDiscountFunctions
) => {
  const isEven = quantity % 2 === 0;

  if (condition?.quantity && quantity > condition?.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }

  return Money({ amount: 0 });
};

const calculateDiscount = (
  amount: Money.Dinero,
  quantity: number,
  condition: Condition | Condition[]
) => {
  const list = Array.isArray(condition) ? condition : [condition];

  const [higherDiscount] = list
    .map((cond) => {
      if (cond.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: cond,
          quantity
        }).getAmount();
      } else if (cond.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: cond,
          quantity
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
    const total = this.items.reduce(
      (accumulator, { quantity, condition, product: { price } }) => {
        const amount = Money({
          amount: quantity * price
        });
        let discount = Money({ amount: 0 });

        if (condition) {
          discount = calculateDiscount(amount, quantity, condition);
        }

        return accumulator.add(amount).subtract(discount);
      },
      Money({ amount: 0 })
    );

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
    const formatted = new Intl.NumberFormat('pt-Br', {
      style: 'currency',
      currency: 'BRL'
    }).format(total);
    const items = this.items;

    return {
      total,
      formatted,
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

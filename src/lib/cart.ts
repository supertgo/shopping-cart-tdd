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
  percentage: number;
  minimum: number;
};

export type Item = {
  product: Product;
  condition?: Condition;
  quantity: number;
};

type Summary = {
  total: number;
  items: Item[];
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

      if (
        currentItem.condition &&
        currentItem.condition.minimum &&
        currentItem.condition.percentage &&
        currentItem.quantity > currentItem.condition.minimum
      ) {
        const percentageDiscount = currentItem.condition.percentage;
        discount = amount.percentage(percentageDiscount);
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

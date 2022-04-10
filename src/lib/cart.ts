import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

type Product = {
  title: string;
  price: number;
};

export type Item = {
  product: Product;
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
      return accumulator.add(
        Money({ amount: currentItem.quantity * currentItem.product.price })
      );
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

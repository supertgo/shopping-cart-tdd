import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';
import { calculateDiscount } from './discount.utils';
import { Item, Product, Summary } from './cart.types';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

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

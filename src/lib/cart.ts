import find from 'lodash/find';
import remove from 'lodash/remove';

type Product = {
  title: string;
  price: number;
};

export type Item = {
  product: Product;
  quantity: number;
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
    return this.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.quantity * currentItem.product.price;
    }, 0);
  }

  remove(product: Product) {
    remove(this.items, { product });
  }
}

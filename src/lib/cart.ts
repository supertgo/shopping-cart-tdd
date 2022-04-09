export type Item = {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
};

export default class Cart {
  items: Item[] = [];

  getTotal() {
    return this.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.quantity * currentItem.product.price;
    }, 0);
  }

  add(item: Item) {
    this.items.push(item);
  }
}

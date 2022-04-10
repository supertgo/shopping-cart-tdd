export type Product = {
  title: string;
  price: number;
};

export type Condition = {
  quantity?: number;
  percentage?: number;
  minimum?: number;
};

export type Item = {
  product: Product;
  condition?: Condition | Condition[];
  quantity: number;
};

export type Summary = {
  total: number;
  items: Item[];
  formatted: string;
};

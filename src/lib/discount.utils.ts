import Money from 'dinero.js';
import { Condition } from './cart.types';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

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

export const calculateDiscount = (
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

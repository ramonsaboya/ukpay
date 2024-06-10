import { Map } from "immutable";

export type PayslipItem = {
  name: string;
  amount: number;
};

export default class PayslipItemList {
  private _items: Map<string, PayslipItem>;

  constructor() {
    this._items = Map();
  }

  get items() {
    return this._items.valueSeq().toArray();
  }

  add(item: PayslipItem) {
    if (!this._items.has(item.name)) {
      this._items = this._items.set(item.name, item);
    } else {
      this._items = this._items.update(item.name, (prev) => ({
        name: item.name,
        amount: prev!.amount + item.amount,
      }));
    }
  }

  get(name: string, defaultValue?: PayslipItem) {
    return this._items.get(name, defaultValue);
  }

  sum(...names: string[]) {
    return this._items.reduce((acc, { name, amount }) => {
      if (names.includes(name)) {
        return acc + amount;
      }
      return acc;
    }, 0);
  }
}

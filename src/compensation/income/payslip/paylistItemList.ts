export type PayslipItem = {
  name: string;
  amount: number;
};

export default class PayslipItemList {
  private _items: Map<string, PayslipItem>;

  constructor() {
    this._items = new Map();
  }

  get items() {
    return Object.values(this._items);
  }

  add({ name, amount }: PayslipItem) {
    if (!this._items.has(name)) {
      this._items.set(name, { name, amount });
    } else {
      this._items.set(name, {
        name,
        amount: this._items.get(name)!.amount + amount,
      });
    }
  }

  get(name: string): number | undefined {
    return this._items.get(name)?.amount;
  }

  getOrDefault(name: string, defaultValue: number): number {
    return this._items.get(name)?.amount ?? defaultValue;
  }

  sum(...names: string[]) {
    const values = Array.from(this._items.values());
    return values.reduce((acc, { name, amount }) => {
      if (names.includes(name)) {
        return acc + amount;
      }
      return acc;
    }, 0);
  }
}

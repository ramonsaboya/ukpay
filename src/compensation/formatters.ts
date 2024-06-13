import { Formatter } from "src/compensation/element/compensation-element";

export function currencyFormatter(): Formatter {
  return {
    display: (value: number) =>
      value.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
      }),
    editAddOn: "£",
  };
}

export function percentageFormatter(): Formatter {
  return {
    display: (value: number) => `${(value * 100).toFixed(0)}%`,
    editAddOn: "%",
  };
}

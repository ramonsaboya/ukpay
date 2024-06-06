export type PayslipItems = Readonly<{
  [key: string]: number;
}>;

export type PayslipData = Readonly<{
  taxCode: string;
  taxPeriod: number;
  earningsItems: PayslipItems;
  benefitsItems: PayslipItems;
}>;

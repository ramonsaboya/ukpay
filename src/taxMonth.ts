enum TaxMonth {
  APRIL = 1,
  MAY = 2,
  JUNE = 3,
  JULY = 4,
  AUGUST = 5,
  SEPTEMBER = 6,
  OCTOBER = 7,
  NOVEMBER = 8,
  DECEMBER = 9,
  JANUARY = 10,
  FEBRUARY = 11,
  MARCH = 12,
}

export default TaxMonth;

export const taxMonthFromPeriod = (n: number): TaxMonth => {
  return n as TaxMonth;
};

export const taxMonthLabel = (taxMonth: TaxMonth): string => {
  const taxMonthLabel = TaxMonth[taxMonth];
  return (
    taxMonthLabel.charAt(0).toUpperCase() + taxMonthLabel.slice(1).toLowerCase()
  );
};

export const TAX_MONTHS = [
  TaxMonth.APRIL,
  TaxMonth.MAY,
  TaxMonth.JUNE,
  TaxMonth.JULY,
  TaxMonth.AUGUST,
  TaxMonth.SEPTEMBER,
  TaxMonth.OCTOBER,
  TaxMonth.NOVEMBER,
  TaxMonth.DECEMBER,
  TaxMonth.JANUARY,
  TaxMonth.FEBRUARY,
  TaxMonth.MARCH,
];

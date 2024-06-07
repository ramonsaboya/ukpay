import { Map, OrderedMap } from "immutable";

export type TaxPeriod = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type TaxPeriodSetup = {
  taxCode: string;
  taxPeriod: TaxPeriod;
};
export type TaxPeriodAmounts = {
  salary: number;
  pensionContribution: number;
  bonus: number;
  benefitsInKind: number;
  wellness: number;
  transportation: number;
  rsuTotal: number;
  rsuTaxOffset: number;
  rsuExcsRefund: number;
};
export type TaxPeriodData = {
  setup: TaxPeriodSetup;
  amounts: TaxPeriodAmounts;
};

export type TaxPeriods = Map<TaxPeriod, TaxPeriodData>;
export type UKPayState = {
  periods: TaxPeriods;
};

type UKPayStateInitializerArgs = {};
export function defaultUKPayState(args: UKPayStateInitializerArgs): UKPayState {
  return {
    periods: OrderedMap(
      Array(12)
        .fill(null)
        .map(
          (_, i) =>
            [
              i + 1,
              {
                setup: { taxCode: "", taxPeriod: (i + 1) as TaxPeriod },
                amounts: {
                  salary: 0,
                  pensionContribution: 0,
                  bonus: 0,
                  benefitsInKind: 0,
                  wellness: 0,
                  transportation: 0,
                  rsuTotal: 0,
                  rsuTaxOffset: 0,
                  rsuExcsRefund: 0,
                },
              },
            ] as [TaxPeriod, TaxPeriodData]
        )
    ),
  };
}

export type UKPayPeriod = {
  level: number;
  salary: number;
};

export type UKPayState = {
  periods: ReadonlyArray<ReadonlyArray<UKPayPeriod>>;
  benefits: { wellness: number; transport: number };
  vests: {
    may: number;
    august: number;
    november: number;
    february: number;
  }
  pensionContribution: {
    employeePercentage: number;
    employerPercentage: number;
  };
};

type UKPayStateInitializerArgs = {};
export function defaultUKPayState(args: UKPayStateInitializerArgs): UKPayState {
  return {
    periods: [[{ level: 1, salary: 0 }, { level: 1, salary: 0 }], [{ level: 1, salary: 0 }]],
    benefits: { wellness: 0, transport: 0 },
    vests: {
      may: 0,
      august: 0,
      november: 0,
      february: 0,
    },
    pensionContribution: { employeePercentage: 0, employerPercentage: 0 },
  };
}

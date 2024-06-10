import taxYearBuilder from "src/hmrc/tax-year-builder";

const TAX_RATES = [
  {
    name: "Tax at 20%",
    rate: 0.2,
    annualLowerLimit: 0,
    annualUpperLimit: 37700,
  },
  {
    name: "Tax at 40%",
    rate: 0.4,
    annualLowerLimit: 37701,
    annualUpperLimit: 125140,
  },
  {
    name: "Tax at 45%",
    rate: 0.45,
    annualLowerLimit: 125141,
    annualUpperLimit: Infinity,
  },
];

export default taxYearBuilder(
  [
    9,
    {
      personalAllowance: 12570,
      taxRates: TAX_RATES,
      nationalInsuranceRates: [
        {
          name: "NI Free",
          rate: 0,
          annualLowerLimit: 0,
          annualUpperLimit: 6396,
        },
        {
          name: "NI at 0%",
          rate: 0,
          annualLowerLimit: 6396,
          annualUpperLimit: 12570,
        },
        {
          name: "NI at 12%",
          rate: 0.12,
          annualLowerLimit: 12571,
          annualUpperLimit: 50270,
        },
        {
          name: "NI at 2%",
          rate: 0.02,
          annualLowerLimit: 50270,
          annualUpperLimit: Infinity,
        },
      ],
    },
  ],
  [
    3,
    {
      personalAllowance: 12570,
      taxRates: TAX_RATES,
      nationalInsuranceRates: [
        {
          name: "NI Free",
          rate: 0,
          annualLowerLimit: 0,
          annualUpperLimit: 6396,
        },
        {
          name: "NI at 0%",
          rate: 0,
          annualLowerLimit: 6396,
          annualUpperLimit: 12570,
        },
        {
          name: "NI at 10%",
          rate: 0.1,
          annualLowerLimit: 12571,
          annualUpperLimit: 50270,
        },
        {
          name: "NI at 2%",
          rate: 0.02,
          annualLowerLimit: 50270,
          annualUpperLimit: Infinity,
        },
      ],
    },
  ]
);

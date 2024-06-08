import taxYearBuilder from "./taxYearBuilder";

export default taxYearBuilder([
  12,
  {
    personalAllowance: 12570,
    taxRates: [
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
    ],
  },
]);

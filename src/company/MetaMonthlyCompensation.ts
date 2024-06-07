import CompanyMonthlyCompensation, {
  PensionContribution,
} from "./CompanyMonthlyCompensation";

export default class MetaMonthlyCompensation extends CompanyMonthlyCompensation {
  get salary(): number {
    // TODO optimize this so have easy access to items, probably create a new class for list of payslip items
    return this.payslip.earnings.reduce((acc, { name, amount }) => {
      if (["SALARY", "COMPANY SICKPAY", "PAYABLE SSP"].includes(name)) {
        return acc + amount;
      } else {
        return acc;
      }
    }, 0);
  }

  get bonus(): number {
    return (
      this.payslip.earnings.find(({ name }) => name === "PERFORM BONUS")
        ?.amount ?? 0
    );
  }

  get taxableBenefits(): number {
    return this.payslip.earnings.reduce((acc, { name, amount }) => {
      if (["WELLNESS", "TRANSPORTATION"].includes(name)) {
        return acc + amount;
      } else {
        return acc;
      }
    }, 0);
  }

  get pension(): PensionContribution {
    const employeeAmount =
      this.payslip.earnings.find(({ name }) => name === "AE PENSION EE")!
        .amount * -1;
    const employeePercentage = Math.round((employeeAmount / this.salary) * 100);
    const employerMatch = this.getEmployerPensionMatch(employeePercentage);

    return {
      employee: {
        amount: employeeAmount,
        percentage: employeePercentage,
      },
      employer: {
        amount: (this.salary * employerMatch) / 100,
        percentage: employerMatch,
      },
    };
  }

  private getEmployerPensionMatch(employeeContribution: number): number {
    switch (employeeContribution) {
      case 0:
      case 1:
      case 2:
        return 0;
      case 3:
        return 6;
      case 4:
        return 7;
      case 5:
        return 8;
      default:
        return 9;
    }
  }
}

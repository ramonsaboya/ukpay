export function getEmployerPensionMatch(
  employeePensionPercentage: number
): number {
  switch (employeePensionPercentage) {
    case 3:
      return 6;
    case 4:
      return 7;
    case 5:
      return 8;
    case 6:
      return 9;
    default:
      return employeePensionPercentage > 6 ? 9 : 0;
  }
}

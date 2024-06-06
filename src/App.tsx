import React, { useReducer, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormLabel,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
} from "@mui/material";
import {
  UKPayDispatchContext,
  useUKPayDispatch,
  useUKPayState,
} from "./state/UKPayDispatchContext";
import { ukPayReducer } from "./state/ukPayReducer";
import { defaultUKPayState } from "./state/ukPayState";
import { getDocument } from "pdfjs-dist";
import processADPPayslip from "./payslip/ADPPayslipProcessor";
import { PayslipData } from "./payslip/PayslipData";

export default function App() {
  const [state, dispatch] = useReducer(ukPayReducer, {}, defaultUKPayState);

  return (
    <Box
      sx={{
        backgroundColor: "grey",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UKPayDispatchContext dispatch={dispatch} ukPayState={state}>
        <UKPayRoot />
      </UKPayDispatchContext>
    </Box>
  );
}

function UKPayRoot() {
  const [showingResults, setShowingResults] = useState(false);
  const showResults = () => {
    setShowingResults(true);
  };

  const [payslipsData, setPayslipsData] = useState<ReadonlyArray<PayslipData>>(
    []
  );

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const payslipsData: Array<PayslipData> = [];

    for (let i = 0; i < files.length; i++) {
      payslipsData.push(await processADPPayslip(files[i]));
    }

    setPayslipsData(payslipsData.sort((a, b) => a.taxPeriod - b.taxPeriod));
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <input type="file" accept=".pdf" multiple onChange={handleFileUpload} />
        {/* <HalfInputCard periodLabel="H1 2023" yearIdx={0} halfIdx={0} />
        <HalfInputCard periodLabel="H2 2023" yearIdx={0} halfIdx={1} />
        <HalfInputCard periodLabel="H1 2024" yearIdx={1} halfIdx={0} />
        <BenefitsInputCard />
        <VestsInputCard />
        <PensionContributionInputCard /> */}
      </Box>
      {/* <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={showResults}>
          Submit
        </Button>
      </Box> */}
      <TextareaAutosize value={JSON.stringify(payslipsData, null, 2)} />
      {showingResults && <Results />}
    </Box>
  );
}

function Results() {
  const columns = [
    "Row",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "Total",
  ];

  let rows: any = [];

  const { periods, benefits, vests, pensionContribution } = useUKPayState();

  let salary: any = new Array(14).fill(0).map((_, idx) => {
    const colName = columns[idx];
    if (idx === 0) {
      return { [colName]: "Salary" };
    } else if (idx === 13) {
      return {
        [colName]:
          (periods[0][0].salary * 5) / 12 +
          (periods[0][1].salary * 6) / 12 +
          (periods[1][0].salary * 1) / 12,
      };
    } else if (idx <= 5) {
      return { [colName]: periods[0][0].salary / 12 };
    } else if (idx <= 11) {
      return { [colName]: periods[0][1].salary / 12 };
    } else if (idx <= 12) {
      return { [colName]: periods[1][0].salary / 12 };
    }
  });
  const mergedSalary = salary.reduce((acc: any, curr: any) => {
    return { ...acc, ...curr };
  }, {});

  rows.push(mergedSalary);

  console.log(rows);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow>
              {columns.map((column) => (
                <TableCell>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function HalfInputCard({
  periodLabel,
  yearIdx,
  halfIdx,
}: {
  periodLabel: string;
  yearIdx: number;
  halfIdx: number;
}) {
  const dispatch = useUKPayDispatch();
  const { periods } = useUKPayState();

  const period = periods[yearIdx][halfIdx];

  return (
    <Box sx={{ width: 250 }}>
      <Card>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormLabel>{periodLabel}</FormLabel>
          <TextField
            label="IC Level"
            value={period.level}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_PERIOD",
                yearIdx,
                halfIdx,
                newValue: {
                  ...period,
                  level: Number(event.target.value),
                },
              })
            }
          />
          <TextField
            label={`Salary in ${periodLabel}`}
            value={period.salary}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_PERIOD",
                yearIdx,
                halfIdx,
                newValue: {
                  ...period,
                  salary: Number(event.target.value),
                },
              })
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function BenefitsInputCard() {
  const dispatch = useUKPayDispatch();
  const { benefits } = useUKPayState();

  return (
    <Box sx={{ width: 250 }}>
      <Card>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormLabel>Benefits from Apr/2023 to Mar/2024</FormLabel>
          <TextField
            label="Life@"
            value={benefits.wellness}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_BENEFITS",
                benefits: {
                  ...benefits,
                  wellness: Number(event.target.value),
                },
              })
            }
          />
          <TextField
            label="Transportation"
            value={benefits.transport}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_BENEFITS",
                benefits: {
                  ...benefits,
                  transport: Number(event.target.value),
                },
              })
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function VestsInputCard() {
  const dispatch = useUKPayDispatch();
  const { vests } = useUKPayState();

  return (
    <Box sx={{ width: 250 }}>
      <Card>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormLabel>Vests (total units, including withheld)</FormLabel>
          <TextField
            label="May/2023"
            value={vests.may}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_VESTS",
                vests: {
                  ...vests,
                  may: Number(event.target.value),
                },
              })
            }
          />
          <TextField
            label="August/2023"
            value={vests.august}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_VESTS",
                vests: {
                  ...vests,
                  august: Number(event.target.value),
                },
              })
            }
          />
          <TextField
            label="November/2023"
            value={vests.november}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_VESTS",
                vests: {
                  ...vests,
                  november: Number(event.target.value),
                },
              })
            }
          />
          <TextField
            label="February/2024"
            value={vests.february}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_VESTS",
                vests: {
                  ...vests,
                  february: Number(event.target.value),
                },
              })
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function PensionContributionInputCard() {
  const dispatch = useUKPayDispatch();
  const { pensionContribution } = useUKPayState();

  return (
    <Box sx={{ width: 250 }}>
      <Card>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FormLabel>Pension Contribution</FormLabel>
          <TextField
            label="Employee"
            value={pensionContribution.employeePercentage}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_PENSION_CONTRIBUTION",
                pensionContribution: {
                  ...pensionContribution,
                  employeePercentage: Number(event.target.value),
                },
              })
            }
          />
          <TextField
            label="Employer"
            value={pensionContribution.employerPercentage}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              dispatch({
                type: "UPDATE_PENSION_CONTRIBUTION",
                pensionContribution: {
                  ...pensionContribution,
                  employerPercentage: Number(event.target.value),
                },
              })
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
}

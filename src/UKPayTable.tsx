import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useUKPayState } from "./state/UKPayDispatchContext";
import { TAX_PERIODS } from "./taxPeriod";
import { UKPAY_TABLE_ROWS } from "./ukPayRows";

export default function UKPayTable() {
  const { companyMonthlyCompensation } = useUKPayState();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {TAX_PERIODS.valueSeq().map(({ month }) => (
              <TableCell key={month}>{month}</TableCell>
            ))}
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* TODO separate the compensation summary fields and have the income tax as a different set of rows in another file */}
          {UKPAY_TABLE_ROWS.map(({ label, value, formatter, aggregate }) => (
            <TableRow key={label}>
              <TableCell>{label}</TableCell>

              {TAX_PERIODS.valueSeq().map(({ id: taxPeriodId, month }) => {
                const compensation =
                  companyMonthlyCompensation.get(taxPeriodId);
                const reactKey = `${label}-${month}`;

                if (compensation == null) {
                  return <TableCell key={reactKey}>{formatter(0)}</TableCell>;
                }

                return (
                  <TableCell key={reactKey} align="right">
                    {formatter(value(compensation))}
                  </TableCell>
                );
              })}

              <TableCell align="right">
                {aggregate != null
                  ? formatter(
                      aggregate(companyMonthlyCompensation.valueSeq().toArray())
                    )
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

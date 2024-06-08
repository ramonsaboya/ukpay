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
import { IncomeTaxRows } from "./hmrc/IncomeTaxRows";

export default function UKPayTable() {
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
          <CompensationSummaryRows />
          <IncomeTaxRows />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CompensationSummaryRows() {
  const { companyCompensation } = useUKPayState();

  return (
    <>
      {UKPAY_TABLE_ROWS.map(({ label, value, formatter, aggregate }) => (
        <TableRow key={label}>
          <TableCell>{label}</TableCell>

          {TAX_PERIODS.valueSeq().map(({ id: taxPeriodId, month }) => {
            const compensation = companyCompensation.get(taxPeriodId);
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
              ? formatter(aggregate(companyCompensation.valueSeq().toArray()))
              : ""}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

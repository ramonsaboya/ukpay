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
import { TAX_MONTHS, taxMonthLabel } from "./taxMonth";
import { useUKPayState } from "./state/UKPayDispatchContext";

export default function UKPayTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {TAX_MONTHS.map((taxMonth) => (
              <TableCell key={taxMonth}>{taxMonthLabel(taxMonth)}</TableCell>
            ))}
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <CompensationSummaryRows />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CompensationSummaryRows() {
  const { compensationElements, calculatedCompensationValues } =
    useUKPayState();

  return (
    <>
      {compensationElements.map(({ rowLabel, type }) => (
        <TableRow key={rowLabel}>
          <TableCell>{rowLabel}</TableCell>

          {TAX_MONTHS.map((taxMonth) => {
            const compensation = calculatedCompensationValues.get(taxMonth);
            const reactKey = `${rowLabel}-${taxMonthLabel(taxMonth)}`;

            if (compensation == null) {
              return <TableCell key={reactKey}>{0}</TableCell>;
            }

            return (
              <TableCell key={reactKey} align="right">
                {compensation.get(type)}
              </TableCell>
            );
          })}

          <TableCell align="right">{0}</TableCell>
        </TableRow>
      ))}
    </>
  );
}

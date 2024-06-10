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
import { useUKPayState } from "src/state/UKPayDispatchContext";
import { TAX_MONTHS, taxMonthLabel } from "src/taxMonth";

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
      {compensationElements.map(({ rowLabel, type, formatter, aggregate }) => {
        const monthlyValues = calculatedCompensationValues
          .map((monthValues) => monthValues.get(type))
          .valueSeq()
          .toArray();

        return (
          <TableRow key={rowLabel}>
            <TableCell>{rowLabel}</TableCell>

            {TAX_MONTHS.map((taxMonth) => {
              const compensation = calculatedCompensationValues.get(taxMonth);
              const reactKey = `${rowLabel}-${taxMonthLabel(taxMonth)}`;

              if (compensation == null) {
                return <TableCell key={reactKey}>{formatter(0)}</TableCell>;
              }

              return (
                <TableCell key={reactKey} align="right">
                  {formatter(compensation.get(type))}
                </TableCell>
              );
            })}

            <TableCell align="right">
              {aggregate != null ? formatter(aggregate(monthlyValues)) : ""}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}

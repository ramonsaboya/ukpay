import { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Box,
} from "@mui/material";
import {
  useUKPayDispatch,
  useUKPayState,
} from "src/state/UKPayDispatchContext";
import { TAX_MONTHS, taxMonthLabel } from "src/taxMonth";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import { Map as ImmutableMap } from "immutable";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import ADPPayslip from "src/compensation/income/payslip/adp-payslip";
import Payslip from "src/compensation/income/payslip/payslip";

const PAYSLIP_PROVIDER_CLASS: { create(file: File): Promise<Payslip> } =
  ADPPayslip;

export default function UKPayTable() {
  const dispatch = useUKPayDispatch();

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const payslipCreators = [];
    for (let i = 0; i < files.length; i++) {
      payslipCreators.push(
        PAYSLIP_PROVIDER_CLASS.create(files[i]).then((payslip) =>
          dispatch({ type: "REGISTER_INCOME_SOURCE", incomeSource: payslip })
        )
      );
    }
    await Promise.all(payslipCreators);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <input type="file" accept=".pdf" multiple onChange={handleFileUpload} />
      </Box>
      <UKPayTableContainer />
    </Box>
  );
}

function UKPayTableContainer() {
  const [editingMonthValues, setEditingMonthValues] = useState<
    ImmutableMap<CompensationElementType, number>
  >(ImmutableMap());
  const setEditingMonthValue = (
    elementType: CompensationElementType,
    value: number
  ) => {
    setEditingMonthValues(editingMonthValues.set(elementType, value));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <UKPayTableHeader editingMonthValues={editingMonthValues} />
        <UKPayTableBody
          editingMonthValues={editingMonthValues}
          setEditingMonthValue={setEditingMonthValue}
        />
      </Table>
    </TableContainer>
  );
}

function UKPayTableHeader({
  editingMonthValues,
}: {
  editingMonthValues: ImmutableMap<CompensationElementType, number>;
}) {
  const { allowEditing, editingMonth } = useUKPayState();
  const dispatch = useUKPayDispatch();

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {TAX_MONTHS.map((taxMonth) => (
          <TableCell key={taxMonth}>{taxMonthLabel(taxMonth)}</TableCell>
        ))}
        <TableCell>Total</TableCell>
        <TableCell>Average</TableCell>
      </TableRow>
      {allowEditing && (
        <TableRow>
          <TableCell></TableCell>
          {TAX_MONTHS.map((taxMonth) => (
            <TableCell key={taxMonth}>
              <Button
                variant="text"
                disabled={editingMonth != null && editingMonth !== taxMonth}
                onClick={() => {
                  if (editingMonth === taxMonth) {
                    dispatch({
                      type: "SAVE_MONTH",
                      manualFixedIncome: new MetaManualFixedIncome(
                        taxMonth,
                        new Map(editingMonthValues.entries())
                      ),
                    });
                  } else {
                    dispatch({
                      type: "SET_EDITING_MONTH",
                      month: taxMonth,
                    });
                  }
                }}
              >
                {editingMonth === taxMonth ? "Save" : "Open"}
              </Button>
            </TableCell>
          ))}
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}
    </TableHead>
  );
}

function UKPayTableBody({
  editingMonthValues,
  setEditingMonthValue,
}: {
  editingMonthValues: ImmutableMap<CompensationElementType, number>;
  setEditingMonthValue: (
    elementType: CompensationElementType,
    value: number
  ) => void;
}) {
  const { compensationElements, calculatedCompensationValues, editingMonth } =
    useUKPayState();

  return (
    <TableBody>
      {compensationElements.valueSeq().map((element) => {
        const { rowLabel, type, formatter, aggregate } = element;
        const monthlyValues = calculatedCompensationValues
          .map((monthValues) => monthValues.get(type)!)
          .valueSeq()
          .toArray();

        return (
          <TableRow key={rowLabel}>
            <TableCell>{rowLabel}</TableCell>

            {TAX_MONTHS.map((taxMonth) => {
              if (editingMonth === taxMonth && element.isManualFixedIncome()) {
                return (
                  <TableCell key={taxMonth}>
                    <TextField
                      size="small"
                      sx={{ height: 5, width: 100 }}
                      variant="standard"
                      value={editingMonthValues.get(type, "")}
                      onChange={(event) =>
                        setEditingMonthValue(type, Number(event.target.value))
                      }
                    />
                  </TableCell>
                );
              }

              const compensation = calculatedCompensationValues.get(taxMonth);
              const reactKey = `${rowLabel}-${taxMonthLabel(taxMonth)}`;

              if (compensation == null) {
                return <TableCell key={reactKey}>{formatter(0)}</TableCell>;
              }

              return (
                <TableCell key={reactKey} align="right">
                  {formatter(compensation.get(type)!)}
                </TableCell>
              );
            })}

            <TableCell align="right">
              {aggregate != null ? formatter(aggregate(monthlyValues)) : ""}
            </TableCell>
            <TableCell align="right">
              {aggregate != null
                ? formatter(aggregate(monthlyValues) / 12)
                : ""}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

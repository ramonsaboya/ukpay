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
} from "@mui/material";
import {
  useUKPayDispatch,
  useUKPayState,
} from "src/state/UKPayDispatchContext";
import { TAX_MONTHS, taxMonthLabel } from "src/taxMonth";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import { Map as ImmutableMap } from "immutable";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";

export default function UKPayTable2() {
  const { editingMonth } = useUKPayState();
  const dispatch = useUKPayDispatch();

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
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {TAX_MONTHS.map((taxMonth) => (
              <TableCell key={taxMonth}>{taxMonthLabel(taxMonth)}</TableCell>
            ))}
            <TableCell>Total</TableCell>
            <TableCell>Average</TableCell>
          </TableRow>
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
        </TableHead>
        <TableBody>
          <CompensationSummaryRows
            editingMonthValues={editingMonthValues}
            setEditingMonthValue={setEditingMonthValue}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CompensationSummaryRows({
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
    <>
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
    </>
  );
}

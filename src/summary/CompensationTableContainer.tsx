import React, { useState } from "react";
import { Box } from "@mui/material";
import { Map as ImmutableMap } from "immutable";
import {
  useUKPayDispatch,
  useUKPayState,
} from "src/state/UKPayDispatchContext";
import TaxMonth, { TAX_MONTHS, taxMonthLabel } from "src/taxMonth";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import {
  CalculatedCompensationValuesByMonth,
  CompensationElementByType,
} from "src/state/uk-pay-state";
import CompensationTable from "src/summary/CompensationTable";
import { MRT_ColumnDef } from "material-react-table";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import { IncomeSourceType } from "src/compensation/income/income-source";
import HeaderCellIcon from "src/summary/HeaderCellIcon";
import EditableCompensationCell from "src/summary/EditableCompensationCell";

export type CompensationRow = {
  elementType: CompensationElementType;
  rowLabel: string;
  monthlyValues: Map<TaxMonth, number>;
  total: number | null;
  average: number | null;
  formatterDisplay: (value: number) => string;
  editAddOn: string;
  isEditable: boolean;
};

export default function CompensationTableContainer() {
  const {
    allowEditing,
    compensationElements,
    calculatedCompensationValues,
    incomeSources,
  } = useUKPayState();
  const dispatch = useUKPayDispatch();

  const [editingMonth, setEditingMonth] = useState<TaxMonth | null>(null);
  const [editingMonthValues, setEditingMonthValues] = useState<
    ImmutableMap<CompensationElementType, string>
  >(getInitialEditingValues(editingMonth, calculatedCompensationValues));

  const getEditingCellValue = (row: CompensationRow) =>
    editingMonthValues.get(row.elementType) ?? "0";
  const onStartEditing = (month: TaxMonth) => {
    setEditingMonth(month);
    setEditingMonthValues(
      getInitialEditingValues(month, calculatedCompensationValues)
    );
  };
  const onEdit = (row: CompensationRow, value: string) => {
    const newValue = value;
    setEditingMonthValues(editingMonthValues.set(row.elementType, newValue));
  };
  const onEditSave = (month: TaxMonth) => {
    if (hasErrors(editingMonthValues)) {
      return;
    }

    dispatch({
      type: "REGISTER_INCOME_SOURCE",
      incomeSource: new MetaManualFixedIncome(
        month,
        new Map(editingMonthValues.map((value) => Number(value)).entries())
      ),
    });
    setEditingMonth(null);
    setEditingMonthValues(ImmutableMap());
  };

  const lockedMonths = new Set(
    incomeSources
      .filter((source) => source.type !== IncomeSourceType.MANUAL_FIXED)
      .map((source) => source.taxMonth)
      .toSet()
      .toJS()
  );

  const columns: MRT_ColumnDef<CompensationRow>[] = [
    {
      id: "elementType", //access nested data with dot notation
      accessorFn: (row) => row.rowLabel,
      header: "",
      size: 400,
      muiTableBodyCellProps: {
        align: "left",
      },
    },
    ...getMonthColumns({
      allowEditing,
      editingMonth,
      lockedMonths,
      hasErrors: hasErrors(editingMonthValues),
      getEditingCellValue,
      onStartEditing,
      onEdit,
      onEditSave,
    }),
    {
      id: "total",
      header: "Total",
      accessorFn: (row) =>
        row.total != null ? row.formatterDisplay(row.total) : "",
    },
    {
      id: "average",
      header: "Average",
      accessorFn: (row) =>
        row.total != null ? row.formatterDisplay(row.total / 12) : "",
    },
  ];

  return (
    <Box sx={{ overflow: "auto" }}>
      <Box
        sx={{
          width: "100%",
          display: "table",
          tableLayout: "fixed",
          padding: 2,
        }}
      >
        <CompensationTable
          columns={columns}
          data={processComepensationData(
            calculatedCompensationValues,
            compensationElements
          )}
        />
      </Box>
    </Box>
  );
}

type MonthColumnsArgs = {
  allowEditing: boolean;
  editingMonth: TaxMonth | null;
  lockedMonths: Set<TaxMonth>;
  hasErrors: boolean;
  getEditingCellValue: (row: CompensationRow) => string;
  onStartEditing: (month: TaxMonth) => void;
  onEdit: (row: CompensationRow, value: string) => void;
  onEditSave: (month: TaxMonth) => void;
};
function getMonthColumns({
  allowEditing,
  editingMonth,
  lockedMonths,
  hasErrors,
  getEditingCellValue,
  onStartEditing,
  onEdit,
  onEditSave,
}: MonthColumnsArgs): MRT_ColumnDef<CompensationRow>[] {
  const headerRenderer: (
    taxMonth: TaxMonth
  ) => MRT_ColumnDef<CompensationRow>["Header"] = (taxMonth: TaxMonth) => () =>
    (
      <>
        <HeaderCellIcon
          allowEditing={allowEditing}
          lockedMonths={lockedMonths}
          taxMonth={taxMonth}
          editingMonth={editingMonth}
          hasErrors={hasErrors}
          onStartEditing={onStartEditing}
          onEditSave={onEditSave}
        />
        {taxMonthLabel(taxMonth)}
      </>
    );

  const cellRenderer: (
    taxMonth: TaxMonth
  ) => MRT_ColumnDef<CompensationRow>["Cell"] =
    (taxMonth: TaxMonth) =>
    ({ renderedCellValue, row }) => {
      const compensationRow = row.original;
      if (editingMonth === taxMonth && compensationRow.isEditable) {
        return (
          <EditableCompensationCell
            value={getEditingCellValue(compensationRow)}
            onValueChange={(event) =>
              onEdit(compensationRow, event.target.value)
            }
            onPressEnter={() => {
              if (editingMonth === taxMonth) {
                onEditSave(taxMonth);
              }
            }}
            addOnSymbol={compensationRow.editAddOn}
          />
        );
      }

      return renderedCellValue;
    };

  return TAX_MONTHS.map(
    (taxMonth) =>
      ({
        id: TaxMonth[taxMonth].toLowerCase(),
        header: taxMonthLabel(taxMonth),
        Header: headerRenderer(taxMonth),
        Cell: cellRenderer(taxMonth),
        accessorFn: (row) =>
          row.formatterDisplay(row.monthlyValues.get(taxMonth) ?? 0),
      } as MRT_ColumnDef<CompensationRow>)
  );
}

function processComepensationData(
  calculatedCompensationValues: CalculatedCompensationValuesByMonth,
  compensationElements: CompensationElementByType
): CompensationRow[] {
  return compensationElements
    .valueSeq()
    .map((element) => {
      const monthlyValuesEntries = calculatedCompensationValues
        .map((monthValues) => monthValues.get(element.type) ?? 0)
        .toArray();

      const aggregate = element.aggregate ?? (() => 0);
      const total = aggregate(monthlyValuesEntries.map(([, value]) => value));

      return {
        elementType: element.type,
        rowLabel: element.rowLabel,
        monthlyValues: new Map(monthlyValuesEntries),
        total: total,
        average: total / 12,
        formatterDisplay: element.formatter.display,
        editAddOn: element.formatter.editAddOn,
        isEditable: element.isManualFixedIncome(),
      } as CompensationRow;
    })
    .toArray();
}

function getInitialEditingValues(
  taxMonth: TaxMonth | null,
  calculatedCompensationValues: CalculatedCompensationValuesByMonth
): ImmutableMap<CompensationElementType, string> {
  if (taxMonth == null) {
    return ImmutableMap();
  }

  const currentMonthValues = calculatedCompensationValues.get(taxMonth);
  if (currentMonthValues == null) {
    return ImmutableMap();
  }

  return currentMonthValues.map((value) => value.toString());
}

function hasErrors(
  editingMonthValues: ImmutableMap<CompensationElementType, string>
) {
  return editingMonthValues.some((value) => Number.isNaN(Number(value)));
}

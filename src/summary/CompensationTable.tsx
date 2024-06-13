import React from "react";
import {
  MRT_ColumnDef,
  useMaterialReactTable,
  MaterialReactTable,
} from "material-react-table";
import { CompensationRow } from "src/summary/CompensationTableContainer";

type CompensationTableProps = {
  columns: MRT_ColumnDef<CompensationRow>[];
  data: CompensationRow[];
};
export default function CompensationTable({
  columns,
  data,
}: CompensationTableProps) {
  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableGlobalFilter: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableEditing: true,
    editDisplayMode: "custom",
    defaultColumn: {
      size: 100,
      maxSize: 100,
      minSize: 100,
    },
    initialState: {
      density: "compact",
      columnPinning: { left: ["elementType"], right: ["total", "average"] },
    },
    muiTableHeadCellProps: {
      align: "right",
      sx: {
        borderRight: "0.5px solid #e0e0e0",
        borderLeft: "0.5px solid #e0e0e0",
        borderBottom: "1px solid #c0c0c0",
      },
    },
    muiTableBodyCellProps: {
      align: "right",
      sx: {
        borderRight: "0.5px solid #e0e0e0",
        borderLeft: "0.5px solid #e0e0e0",
      },
    },
    muiTableHeadProps: {
      sx: {
        "& th:nth-of-type(even)": {
          backgroundColor: "#f5f5f5",
        },
      },
    },
    muiTableBodyProps: {
      sx: {
        "& td:nth-of-type(even)": {
          backgroundColor: "#f5f5f5",
        },
      },
    },
    muiTablePaperProps: {
      sx: {
        borderTop: "1px solid #e0e0e0",
      },
    },
  });

  return <MaterialReactTable table={table} />;
}

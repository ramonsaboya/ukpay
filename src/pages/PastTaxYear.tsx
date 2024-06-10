import React, { useReducer } from "react";
import { Box } from "@mui/material";
import {
  UKPayDispatchContext,
  useUKPayDispatch,
} from "../state/UKPayDispatchContext";
import { ukPayReducer } from "../state/ukPayReducer";
import { defaultUKPayState } from "../state/ukPayState";
import UKPayTable from "../UKPayTable";
import Payslip from "../compensation/income/payslip/payslip";
import ADPPayslip from "../compensation/income/payslip/adpPayslip";

const PAYSLIP_PROVIDER_CLASS: { create(file: File): Promise<Payslip> } =
  ADPPayslip;

export default function PastTaxYear() {
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
      <UKPayTable />
    </Box>
  );
}

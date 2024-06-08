import React, { useReducer } from "react";
import { Box } from "@mui/material";
import {
  UKPayDispatchContext,
  useUKPayDispatch,
} from "./state/UKPayDispatchContext";
import { ukPayReducer } from "./state/ukPayReducer";
import { defaultUKPayState } from "./state/ukPayState";
import UKPayTable from "./UKPayTable";
import { Payslip } from "./payslip/payslip";
import CompanyMonthlyCompensation from "./company/companyMonthlyCompensation";
import MetaMonthlyCompensation from "./company/metaMonthlyCompensation";
import ADPPayslip from "./payslip/adpPayslip";

const COMPANY_MONTHLY_COMPENSATION_CLASS: {
  new (payslip: Payslip): CompanyMonthlyCompensation;
} = MetaMonthlyCompensation;
const PAYSLIP_PROVIDER_CLASS: { new (file: File): Payslip } = ADPPayslip;

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
  const dispatch = useUKPayDispatch();

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const payslips = [];
    for (let i = 0; i < files.length; i++) {
      payslips.push(new PAYSLIP_PROVIDER_CLASS(files[i]));
    }
    await Promise.all(payslips.map((payslip) => payslip.process()));

    payslips.forEach((payslip) => {
      const monthlyCompensation = new COMPANY_MONTHLY_COMPENSATION_CLASS(
        payslip
      );
      dispatch({
        type: "REGISTER_MONTHLY_COMPENSATION",
        monthlyCompensation,
      });
    });
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

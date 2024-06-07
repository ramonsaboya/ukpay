import React, { useReducer } from "react";
import { Box } from "@mui/material";
import {
  UKPayDispatchContext,
  useUKPayDispatch,
} from "./state/UKPayDispatchContext";
import { ukPayReducer } from "./state/ukPayReducer";
import { defaultUKPayState } from "./state/ukPayState";
import processADPPayslip from "./payslip/ADPPayslipProcessor";
import UKPayTable from "./UKPayTable";

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

    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(
        processADPPayslip(files[i]).then((data) => {
          dispatch({
            type: "REGISTER_PAY_PERIOD",
            taxPeriod: data.setup.taxPeriod,
            data,
          });
        })
      );
    }
    await Promise.all(promises);
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

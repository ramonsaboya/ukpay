import { Alert, Box, Button, styled } from "@mui/material";
import ADPPayslip from "src/compensation/income/payslip/adp-payslip";
import Payslip from "src/compensation/income/payslip/payslip";
import PageStructure, { DrawerContentRenderer } from "src/pages/PageStructure";
import { useUKPayDispatch } from "src/state/UKPayDispatchContext";
import CompensationTableContainer from "src/summary/CompensationTableContainer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PAYSLIP_PROVIDER_CLASS: { create(file: File): Promise<Payslip> } =
  ADPPayslip;

export default function CompensationSummary() {
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

  const DrawerContent = ((setIsDrawerOpen) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 1,
        gap: 1,
      }}
    >
      <Button
        component="label"
        variant="contained"
        size="small"
        startIcon={<CloudUploadIcon />}
      >
        Upload payslips
        <VisuallyHiddenInput
          type="file"
          accept=".pdf"
          multiple
          onChange={(event) => {
            handleFileUpload(event).then(() => setIsDrawerOpen(false));
          }}
        />
      </Button>
      <Alert severity="info">
        Payslips are processed locally in your browser and no data is sent to
        any server.
      </Alert>
      <Alert severity="info">You may turn off your internet connection.</Alert>
    </Box>
  )) as DrawerContentRenderer;

  return (
    <PageStructure drawerContent={DrawerContent} defaultDrawerState="open">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CompensationTableContainer />
      </Box>
    </PageStructure>
  );
}

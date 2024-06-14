import { Box, Button, styled } from "@mui/material";
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

// TODO gotta clean up this component
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

  const drawerContent = ((setOpen) => (
    <>
      <Button
        component="label"
        variant="contained"
        size="small"
        sx={{ margin: 2 }}
        startIcon={<CloudUploadIcon />}
      >
        Upload payslips
        <VisuallyHiddenInput
          type="file"
          accept=".pdf"
          multiple
          onChange={(event) => {
            handleFileUpload(event).then(() => setOpen(false));
          }}
        />
      </Button>
      <Box sx={{ margin: 2 }}>
        All payslips are processed locally in your browser. No data is sent to
        any server. Feel free to turn off your internet connection before
        uploading your payslips.
      </Box>
    </>
  )) as DrawerContentRenderer;

  return (
    <PageStructure drawerContent={drawerContent} defaultDrawerState="open">
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

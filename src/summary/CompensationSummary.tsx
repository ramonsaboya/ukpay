import { Button, Box, styled } from "@mui/material";
import { useUKPayDispatch } from "src/state/UKPayDispatchContext";
import ADPPayslip from "src/compensation/income/payslip/adp-payslip";
import Payslip from "src/compensation/income/payslip/payslip";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CompensationTableContainer from "src/summary/CompensationTableContainer";

const PAYSLIP_PROVIDER_CLASS: { create(file: File): Promise<Payslip> } =
  ADPPayslip;

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          padding: 1,
        }}
      >
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload payslips
          <VisuallyHiddenInput
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
          />
        </Button>
      </Box>
      <CompensationTableContainer />
    </Box>
  );
}

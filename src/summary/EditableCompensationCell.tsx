import { TextField, InputAdornment } from "@mui/material";

type Props = {
  value: string;
  onValueChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onPressEnter: () => void;
  addOnSymbol: string;
};
export default function EditableCompensationCell({
  value,
  onValueChange,
  onPressEnter,
  addOnSymbol,
}: Props) {
  return (
    <TextField
      size="small"
      value={value}
      onChange={onValueChange}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onPressEnter();
        }
      }}
      error={Number.isNaN(Number(value))}
      variant="standard"
      fullWidth={false}
      margin="none"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{addOnSymbol}</InputAdornment>
        ),
      }}
      inputProps={{
        style: {
          height: "14px",
          textAlign: "right",
          fontSize: "0.875rem",
        },
      }}
      sx={{
        // makes sure that the value will still be aligned with other columns
        marginTop: "2px",
        marginBottom: "-2px",
        marginLeft: "15px",
      }}
    />
  );
}

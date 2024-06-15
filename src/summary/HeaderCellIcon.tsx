import { IconButton } from "@mui/material";
import TaxMonth from "src/hmrc/tax-month";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";

type Props = {
  allowEditing: boolean;
  lockedMonths: Set<TaxMonth>;
  taxMonth: TaxMonth;
  editingMonth: TaxMonth | null;
  hasErrors: boolean;
  onStartEditing: (month: TaxMonth) => void;
  onEditSave: (month: TaxMonth) => void;
};
export default function HeaderCellIcon({
  allowEditing,
  lockedMonths,
  taxMonth,
  editingMonth,
  hasErrors,
  onStartEditing,
  onEditSave,
}: Props) {
  if (!allowEditing) {
    return null;
  }

  if (lockedMonths.has(taxMonth)) {
    return (
      <IconButton size="small" disabled>
        <LockIcon
          fontSize="small"
          sx={{ height: "16px", width: "16px", marginTop: "-2px" }}
        />
      </IconButton>
    );
  }

  return (
    <IconButton
      size="small"
      disabled={
        (editingMonth !== null && editingMonth !== taxMonth) || hasErrors
      }
      onClick={() => {
        if (editingMonth === taxMonth) {
          onEditSave(taxMonth);
        } else {
          onStartEditing(taxMonth);
        }
      }}
    >
      {editingMonth !== taxMonth ? (
        <EditIcon
          fontSize="small"
          sx={{ height: "16px", width: "16px", marginTop: "-2px" }}
        />
      ) : (
        <SaveIcon
          fontSize="small"
          sx={{ height: "16px", width: "16px", marginTop: "-2px" }}
          color={!hasErrors ? "primary" : "disabled"}
        />
      )}
    </IconButton>
  );
}

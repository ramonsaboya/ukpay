import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function PastTaxYear() {
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
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea component={Link} to={"/past-tax-year"}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Past tax year
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analyse your payslips from a past tax year
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

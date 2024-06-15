import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import PageStructure from "src/pages/PageStructure";

export default function Home() {
  return (
    <PageStructure hideDrawer>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PageCard
          title="Past tax year"
          description="Analyse your payslips from 2023/24"
          link="/ukpay/past-tax-year"
        />
        <PageCard
          title="Current tax year"
          description="Analyse your compensation for 2024/25"
          link="/ukpay/current-tax-year"
        />
      </Box>
    </PageStructure>
  );
}

type PageCardProps = {
  title: string;
  description: string;
  link: string;
};
function PageCard({ title, description, link }: PageCardProps) {
  return (
    <Card>
      <CardActionArea component={Link} to={link}>
        <CardContent
          sx={{
            height: "20vh",
            width: "30vh",
            backgroundColor: "rgba(220, 220, 220, 0.5)",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

import React, { useState } from "react";
import {
  Toolbar,
  IconButton,
  Typography,
  styled,
  Drawer,
  Divider,
  Box,
  CssBaseline,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 300;

export type DrawerContentRenderer = (
  setOpen: (open: boolean) => void
) => React.ReactNode;
export default function PageStructure({
  children,
  drawerContent,
  hideDrawer,
  defaultDrawerState = "closed",
}: {
  children: React.ReactNode;
  drawerContent?: React.ReactNode | DrawerContentRenderer;
  hideDrawer?: boolean;
  defaultDrawerState?: "open" | "closed";
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(
    defaultDrawerState === "open"
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" isDrawerOpen={isDrawerOpen}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              ...(isDrawerOpen && { display: "none" }),
              ...(hideDrawer && { display: "none" }),
            }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            UK Pay
          </Typography>
          <Typography component="div">
            {"You can also run locally ->"}
          </Typography>
          <IconButton
            aria-label="GitHub"
            href="https://github.com/ramonsaboya/ukpay"
            target="_blank"
          >
            <GitHubIcon sx={{ color: "white" }} fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
      >
        <DrawerHeader>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        {drawerContent instanceof Function
          ? drawerContent(setIsDrawerOpen)
          : drawerContent}
      </Drawer>
      <Main isDrawerOpen={isDrawerOpen}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "isDrawerOpen",
})<{
  isDrawerOpen?: boolean;
}>(({ theme, isDrawerOpen }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(isDrawerOpen && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  isDrawerOpen?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "isDrawerOpen",
})<AppBarProps>(({ theme, isDrawerOpen }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isDrawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import GroupIcon from "@mui/icons-material/Group";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import ScienceIcon from "@mui/icons-material/Science";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Modal, Button, Typography } from "@mui/material";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// ListItem styles with hover and selected effects
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transition: "background-color 0.3s ease",
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.selected,
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.text.secondary,
    minWidth: "40px",
    "@media (max-width:600px)": {
      minWidth: "unset",
    },
  },
  "& .MuiListItemText-root": {
    color: theme.palette.text.primary,
  },
}));

// Logout button with red hover effect
const StyledLogoutButton = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.error.main,
  "&:hover": {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    transition: "background-color 0.3s ease",
  },
}));

// Modal container for a centered look
const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  textAlign: "center",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openLogoutModal, setOpenLogoutModal] = React.useState(false); // Modal state
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogoutModalOpen = () => {
    setOpenLogoutModal(true);
  };

  const handleLogoutModalClose = () => {
    setOpenLogoutModal(false);
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/main-login"); // Change this path to where you want the user to be redirected
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "Doctors", icon: <LocalHospitalIcon />, path: "/doctors" },
    { text: "Patients", icon: <GroupIcon />, path: "/patients" },
    { text: "Pharmacy", icon: <LocalPharmacyIcon />, path: "/pharmacy" },
    { text: "Labs", icon: <ScienceIcon />, path: "/labs" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar handleDrawerOpen={handleDrawerOpen} isDrawerOpen={open} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            "@media (max-width:600px)": {
              width: 80, // Adjust width for small screens
            },
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}>
        <Box>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <StyledListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    "& .MuiListItemText-root": {
                      display: { xs: "none", sm: "block" }, // Hide text on small screens
                    },
                  }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </StyledListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <StyledLogoutButton onClick={handleLogoutModalOpen}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{ display: { xs: "none", sm: "block" } }}
              />
            </StyledLogoutButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* Your main content goes here */}
      </Main>

      {/* Logout Confirmation Modal */}
      <Modal
        open={openLogoutModal}
        onClose={handleLogoutModalClose}
        aria-labelledby="logout-confirmation-title"
        aria-describedby="logout-confirmation-description">
        <ModalContainer>
          <Typography
            id="logout-confirmation-title"
            variant="h6"
            component="h2">
            Are you sure you want to logout?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{ mr: 1, backgroundColor: theme.palette.error.main }}>
              Logout
            </Button>
            <Button onClick={handleLogoutModalClose} variant="outlined">
              Cancel
            </Button>
          </Box>
        </ModalContainer>
      </Modal>
    </Box>
  );
}

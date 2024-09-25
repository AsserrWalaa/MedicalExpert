import * as React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface NavbarProps {
  handleDrawerOpen: () => void;
  isDrawerOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ handleDrawerOpen, isDrawerOpen }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Menu Icon to open Drawer */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(isDrawerOpen && { display: "none" }) }}>
          <MenuIcon />
        </IconButton>
        {/* Logo and Brand Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <img
            src="/path/to/logo.png" // Replace with your logo path
            alt="Logo"
            style={{ height: 40, marginRight: 8 }} // Adjust size as needed
          /> */}
          <Typography variant="h6" noWrap component="div">
            Brand Name
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

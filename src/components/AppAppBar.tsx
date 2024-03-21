"use client";
import React, { useState, useEffect } from "react";
import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

interface AppAppBarProps {
  mode: PaletteMode;
  // toggleColorMode: () => void;
}

function AppAppBar({ mode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);
  const toggleColorMode = () => {
    console.log(
      "Theme changed. Look into the test.tsx file to see the implementation."
    );
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <img
                src={"/logo.png"}
                style={logoStyle}
                alt="logo of boost link"
              />
              <a style={{ textDecoration: "none" }} href="/create-b-link">
                <MenuItem sx={{ py: "6px", px: "12px" }}>
                  <Typography variant="body2" color="text.primary">
                    Leads
                  </Typography>
                </MenuItem>
              </a>
              <a style={{ textDecoration: "none" }} href="/b-link-dashboard">
                <MenuItem sx={{ py: "6px", px: "12px" }}>
                  <Typography variant="body2" color="text.primary">
                    New Lead
                  </Typography>
                </MenuItem>
              </a>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <a style={{ textDecoration: "none" }} href="/articles">
                  <MenuItem sx={{ py: "6px", px: "12px" }}>
                    <Typography variant="body2" color="text.primary">
                      Articles
                    </Typography>
                  </MenuItem>
                </a>

                <a style={{ textDecoration: "none" }} href="/ai-article-writer">
                  <MenuItem sx={{ py: "6px", px: "12px" }}>
                    <Typography variant="body2" color="text.primary">
                      Article Writer
                    </Typography>
                  </MenuItem>
                </a>

                <a style={{ textDecoration: "none" }} href="/about-us">
                  <MenuItem sx={{ py: "6px", px: "12px" }}>
                    <Typography variant="body2" color="text.primary">
                      About Us
                    </Typography>
                  </MenuItem>
                </a>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
              <a style={{ textDecoration: "none" }} href="/signin">
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component="a"
                  href="/material-ui/getting-started/templates/sign-in/"
                  target="_blank"
                >
                  Sign in
                </Button>
              </a>
              <a style={{ textDecoration: "none" }} href="/signup">
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component="a"
                  href="/material-ui/getting-started/templates/sign-up/"
                  target="_blank"
                >
                  Sign up
                </Button>
              </a>
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  {/* <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode
                      mode={mode}
                      // toggleColorMode={toggleColorMode}
                    />
                  </Box> */}
                  <a
                    style={{ textDecoration: "none" }}
                    href="/b-link-dashboard"
                  >
                    <MenuItem>Leads</MenuItem>
                  </a>
                  <a style={{ textDecoration: "none" }} href="/create-b-link">
                    <MenuItem>New Leads</MenuItem>
                  </a>
                  <a style={{ textDecoration: "none" }} href="/articles">
                    <MenuItem>Articles</MenuItem>
                  </a>
                  <a
                    style={{ textDecoration: "none" }}
                    href="/ai-article-writer"
                  >
                    <MenuItem>Article Writer</MenuItem>
                  </a>
                  <a style={{ textDecoration: "none" }} href="/about-us">
                    <MenuItem>About Us</MenuItem>
                  </a>
                  <Divider />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      component="a"
                      href="/material-ui/getting-started/templates/sign-up/"
                      target="_blank"
                      sx={{ width: "100%" }}
                    >
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      href="/material-ui/getting-started/templates/sign-in/"
                      target="_blank"
                      sx={{ width: "100%" }}
                    >
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;

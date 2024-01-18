"use client"; // This is a client component 👈🏽

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { v4 as uuidv4 } from "uuid";
import { logoImage } from "../constants/img-src";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import firebase_app from "../firebase/config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import NavbarDropDown from "./navbar-dropdown"
import { usePathname } from 'next/navigation';



// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app);

const pages = [
  { name: "Home", url: "/" },
  { name: "Articles", url: "/articles" },
  { name: "About Us", url: "/about-us" },
  { name: "Article Writer", url: "/ai-article-writer" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const [user, setUser] = React.useState<any>();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid);
        setUser(uid);
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
        setUser(null);
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const pathName=usePathname()


  return (
    <>
    {pathName.includes("/boosted-link/")? null :  <AppBar position="static" color="transparent">
      <Container maxWidth="xl" style={{ justifyContent: "space-around" }}>
        <Toolbar disableGutters style={{ justifyContent: "space-around" }}>
          <Box style={{ display: "flex" }}>
            <img src={logoImage} alt="logo-image" width="74px" height="34px" />
            <Typography
              ml={2}
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <a
                  key={uuidv4()}
                  style={{ textDecoration: "none", color: "black" }}
                  href={page.url}
                >
                  <MenuItem key={page.url} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                </a>
              ))}
              <NavbarDropDown />
              {user ? (
                <Button onClick={handleLogout}>
                  <Typography textAlign="center">LogOut</Typography>
                </Button>
              ) : (
                <a
                  style={{ textDecoration: "none", color: "black" }}
                  href={"/signin"}
                >
                  <Button>
                    <Typography textAlign="center">Login</Typography>
                  </Button>
                </a>
              )}
            </Menu>
          </Box>
          <Box style={{ justifyContent: "space-around" }}>
            <Box>
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                LOGO
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                justifyContent: "flex-end",
                display: { xs: "none", md: "flex" },
              }}
            >
              {pages.map((page) => (
                <a
                  href={page.url}
                  key={uuidv4()}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "black", display: "block" }}
                  >
                    {page.name}
                  </Button>
                </a>
              ))}
              <NavbarDropDown />
           
               {/* <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Option 1</MenuItem>
        <MenuItem onClick={handleClose}>Option 2</MenuItem>
        <MenuItem onClick={handleClose}>Option 3</MenuItem>
      </Menu> */}
              {user ? (
                <Button
                  onClick={handleLogout}
                  sx={{ my: 2, color: "black", display: "block" }}
                >
                  LogOut
                </Button>
              ) : (
                <a
                  style={{ textDecoration: "none", color: "black" }}
                  href={"/signin"}
                >
                  <Button sx={{ my: 2, color: "black", display: "block" }}>
                    Login
                  </Button>
                </a>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>}
   
    </>
  );
}
export default ResponsiveAppBar;

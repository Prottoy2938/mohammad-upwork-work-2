"use client";
import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles, fade } from "@material-ui/core/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import firebase_app from "../firebase/config";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const auth = getAuth(firebase_app);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar: React.FC = () => {
  const classes: any = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>();
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const router = useRouter();

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

  const pathName = usePathname();

  const handleSearch = (event: any) => {
    event.preventDefault();
    router.push(`/search?q=${searchQuery}`);
  };

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

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsDrawerOpen(open);
    };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Boosted Link
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div
          className={classes.drawer}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {/* Add your drawer items here */}
            <ListItem button>
              <a href="/">
                <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
                <ListItemText primary="Home" />
              </a>
            </ListItem>
            <ListItem button>
              <a href="/ai-article-writer">
                <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
                <ListItemText primary="Article Wrtier" />
              </a>
            </ListItem>
            <ListItem button>
              <a href="/articles">
                <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
                <ListItemText primary="Articles" />
              </a>
            </ListItem>
            <ListItem button>
              <a href="/about-us">
                <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
                <ListItemText primary="About Us" />
              </a>
            </ListItem>

            {user ? (
              <ListItem button onClick={handleLogout}>
                <div>
                  <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
                  <ListItemText primary="LogOut" />
                </div>
              </ListItem>
            ) : (
              <ListItem button onClick={handleLogout}>
                <a href="/signin">
                  <ListItemIcon>{/* Add your icon here */}</ListItemIcon>
                  <ListItemText primary="Login" />
                </a>
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;

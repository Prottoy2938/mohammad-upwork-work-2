"use client";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Link, Grid, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(4),
    marginTop: "auto",
  },
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              © {new Date().getFullYear()} My Website. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" align="right">
              Made with love by{" "}
              <Link
                href="https://www.example.com"
                target="_blank"
                rel="noopener"
                className={classes.link}
              >
                Your Name
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;

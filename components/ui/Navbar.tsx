import { AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { FC } from "react";

const Navbar: FC<{
  classes: {
    readonly [key: string]: string;
  };
}> = ({ classes }) => {
  return (
    <header>
      <AppBar className={classes.navbar} elevation={0}>
        <Toolbar>
          <Link className={classes.link} href="/">
            <Typography variant="h6" component="div">
              Home
            </Typography>
          </Link>
          <Link className={classes.link} href="/help">
            <Typography variant="h6" component="div">
              Help
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Navbar;

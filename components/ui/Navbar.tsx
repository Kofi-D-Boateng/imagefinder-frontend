import { AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { FC } from "react";
import logo from "../../assets/Image_Finder.png";

const Navbar: FC<{
  classes: {
    readonly [key: string]: string;
  };
  title: string;
}> = ({ classes, title }) => {
  return (
    <AppBar className={classes.navbar} elevation={1}>
      <Toolbar>
        {title != "ImageFinder" && (
          <Link className={classes.link2} href="/">
            <img src={logo.src} className={classes.logo} alt="logo.png" />
          </Link>
        )}
        <Link
          className={title === "ImageFinder" ? classes.link : classes.link2}
          href="/"
        >
          <Typography variant="h6" component="div">
            Home
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

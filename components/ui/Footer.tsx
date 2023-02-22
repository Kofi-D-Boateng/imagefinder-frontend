import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

const Footer: FC<{
  classes: {
    readonly [key: string]: string;
  };
}> = ({ classes }) => {
  return (
    <footer>
      <AppBar
        sx={{
          backgroundColor: "lightgray",
          textAlign: "center",
          top: "auto",
          bottom: "0",
        }}
        position="fixed"
        elevation={0}
      >
        <Toolbar>
          <Grid container>
            <Grid sx={{ margin: "auto" }} xs={4} md={4} item>
              <Link className={classes.link} href="/">
                <Typography variant="h6">Home</Typography>
              </Link>
            </Grid>
            <Grid sx={{ margin: "auto" }} xs={4} md={4} item>
              <Typography variant="body1">
                © {new Date().getFullYear()} ImageFinder
              </Typography>
            </Grid>
            <Grid sx={{ margin: "auto" }} xs={4} md={4} item>
              <Link className={classes.link} href="/help#search">
                <Typography variant="h6">How it works</Typography>
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </footer>
  );
};

export default Footer;

import { Grid, Typography } from "@mui/material";
import { FC } from "react";

const Footer: FC<{
  classes: {
    readonly [key: string]: string;
  };
  isMobile: boolean;
  title: string;
}> = ({ classes, isMobile, title }) => {
  return (
    <footer
      className={
        !isMobile
          ? classes.footer
          : title === "Result"
          ? classes.footer
          : classes.footerMobile
      }
    >
      <Grid container>
        <Typography sx={{ margin: "auto" }} variant="body1">
          © {new Date().getFullYear()} ImageFinder
        </Typography>
      </Grid>
    </footer>
  );
};

export default Footer;

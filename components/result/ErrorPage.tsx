import { Box, Grid, Typography } from "@mui/material";
import { FC } from "react";
import Layout from "../ui/Layout";
import errorPhoto from "../../assets/error-photo.png";

const ErrorPage: FC<{
  classes: {
    readonly [key: string]: string;
  };
}> = ({ classes }) => {
  return (
    <Layout title="Error">
      <Box className={classes.errorDiv}>
        <Grid className={classes.errorGrid} container>
          <Grid container>
            <img src={errorPhoto.src} alt="error.png" />
          </Grid>
          <Grid container>
            <Typography
              sx={{
                margin: "auto",
              }}
              variant="h4"
            >
              Oh No!
            </Typography>
          </Grid>
          <Grid container>
            <Typography
              sx={{
                margin: "auto",
              }}
              variant="body1"
            >
              There seems to be an error on our end. Please try again in a
              couple minutes.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ErrorPage;

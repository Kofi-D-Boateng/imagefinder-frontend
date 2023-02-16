import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { FC } from "react";
import Layout from "../Layout";

const ErrorPage: FC<{
  classes: {
    readonly [key: string]: string;
  };
}> = () => {
  return (
    <Layout title="Error">
      <Box sx={{ position: "absolute", top: "50%", left: "50%", zIndex: "5" }}>
        <Grid container>
          <Typography variant="h4">Oh No!</Typography>
        </Grid>
        <Grid container>
          <Typography variant="body1">
            There seems to be an error on our end. Please try again in a couple
            minutes.
          </Typography>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ErrorPage;

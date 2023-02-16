import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { FC } from "react";
import Layout from "../Layout";

const InProgress: FC<{
  classes: {
    readonly [key: string]: string;
  };
}> = ({ classes }) => {
  return (
    <Layout title="Searching...">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: "5",
          textAlign: "center",
        }}
      >
        <Grid
          sx={{ margin: "auto", textAlign: "center", backgroundColor: "red" }}
          container
        >
          <Typography variant="h4" className={classes.text}>
            Get a bite to eat, while we grab what you need!
          </Typography>
        </Grid>
        <Grid container>
          <CircularProgress />
        </Grid>
      </Box>
    </Layout>
  );
};

export default InProgress;

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
      <Box className={classes.searchDiv}>
        <Grid className={classes.searchGrid} container>
          <Grid container>
            <Typography variant="h4" className={classes.text}>
              Get a bite to eat, while we grab what you need!
            </Typography>
          </Grid>
          <Grid container>
            <CircularProgress sx={{ margin: "auto" }} />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default InProgress;

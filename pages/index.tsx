import { FormEvent } from "react";
import { NextRouter, useRouter } from "next/router";
import { Grid } from "@mui/material";
import Layout from "../components/Layout";
import logo from "assets/Image_Finder.png";
import classes from "../styles/homepage.module.css";
import InputForm from "../components/form/InputForm";

enum SearchType {
  SINGLE = "SINGLE",
  VERBOSE = "VERBOSE",
}

const IndexPage = () => {
  const router: NextRouter = useRouter();
  const urlSubmitionHandler: (event: FormEvent<HTMLFormElement>) => void = (
    e
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("urlTextArea");
    const searchType = formData.get("deepSearch");
    router.push({
      pathname: "/search",
      query: {
        q: value.toString(),
        style: searchType === "on" ? SearchType.VERBOSE : SearchType.SINGLE,
      },
    });
  };
  return (
    <Layout title="ImageFinder">
      <Grid className={classes.logo} container>
        <img src={logo.src} alt="logo.png" />
      </Grid>
      <Grid container>
        <InputForm classes={classes} submit={urlSubmitionHandler} />
      </Grid>
    </Layout>
  );
};

export default IndexPage;

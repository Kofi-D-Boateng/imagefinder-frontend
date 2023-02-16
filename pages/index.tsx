import { ChangeEvent, FocusEvent, FormEvent, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { Grid, Typography } from "@mui/material";
import Layout from "../components/Layout";
import logo from "assets/Image_Finder.png";
import classes from "../styles/homepage.module.css";
import InputForm from "../components/form/InputForm";
import { wordCache } from "@/components/ui/classes/wordCacheSingleton";

enum SearchType {
  SINGLE = "SINGLE",
  VERBOSE = "VERBOSE",
}

const IndexPage = () => {
  const router: NextRouter = useRouter();
  const [isValid, setIsValid] = useState<boolean>(false);
  const cache = wordCache.getCache();
  const urlSubmitionHandler: (event: FormEvent<HTMLFormElement>) => void = (
    e
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("urlTextArea");
    const searchType = formData.get("deepSearch");
    if (!isValid) return;
    router.push({
      pathname: "/search",
      query: {
        q: value.toString(),
        style: searchType === "on" ? SearchType.VERBOSE : SearchType.SINGLE,
      },
    });
  };
  const onFocusHandler: (event: FocusEvent<HTMLInputElement>) => void = (e) => {
    const value = e.currentTarget.value;
    console.log(value);
    if (!value) {
      if (isValid) {
        setIsValid(false);
      }
      return;
    }
    console.log(value);
  };

  const onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void = (
    e
  ) => {
    const urlPattern =
      /^(http(s)?:\/\/)?(www\.)?([a-z]+\.)?(com|net|org|edu|gov|mil|biz|info|io|ai)(\/[\w\-\.\?\=\&]*)*$/i;
    const value: string[] = e.currentTarget.value.split(",");
    for (const string of value) {
      console.log(string);
      console.log(cache.search(string));
      if (!cache.search(string)) {
        if (!string.match(urlPattern)) {
          if (isValid) {
            setIsValid(false);
            return;
          }
        } else {
          console.log("INSERTING");
          cache.insert(string);
          if (!isValid) {
            setIsValid(true);
          }
        }
      } else {
        console.log("True");
      }
    }
  };

  return (
    <Layout title="ImageFinder">
      <Grid className={classes.logo} container>
        <img src={logo.src} alt="logo.png" />
      </Grid>
      {!isValid && (
        <Grid container className={classes.criteria}>
          <Typography sx={{ margin: "0 auto 5px auto" }} variant="body1">
            Urls must start with http, https, or www
          </Typography>
          <Typography sx={{ margin: "5px auto" }} variant="body1">
            Urls must include a valid subdomain (.com,.net,etc..)
          </Typography>
        </Grid>
      )}
      <Grid container>
        <InputForm
          classes={classes}
          submit={urlSubmitionHandler}
          focus={onFocusHandler}
          change={onChangeHandler}
        />
      </Grid>
    </Layout>
  );
};

export default IndexPage;

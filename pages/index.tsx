import { ChangeEvent, FocusEvent, FormEvent, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { Grid, Typography } from "@mui/material";
import Layout from "../components/ui/Layout";
import logo from "assets/Image_Finder.png";
import classes from "../styles/homepage.module.css";
import InputForm from "../components/form/InputForm";
import { WordCacheSingleton } from "classes/wordCacheSingleton";
import { SearchType } from "../enums/Search";

const IndexPage = () => {
  const router: NextRouter = useRouter();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isSetToMultiSearch, SetIsSetToMultiSearch] = useState<boolean>(false);
  const [limit, setLimit] = useState<{ [key: string]: number }>({
    regular: 10,
    deepsearch: 5,
  });
  const urlPattern =
    /^(http(s)?:\/\/)?(www\.)?([a-z0-9]+\.)?(com|net|org|edu|gov|mil|biz|info|io|ai)(\/[\w\-\.\?\=\&]*)*$/i;
  const cache = WordCacheSingleton.getCache();
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
    const values: string[] = e.currentTarget.value.split(",");
    let count = values.length;
    for (const string of values) {
      const str = string.trim();
      if (!cache.search(str)) {
        if (urlPattern.test(str)) {
          cache.insert(str);
          count--;
          if (isSetToMultiSearch) {
            setLimit((prev) => {
              if (prev.deepsearch > 0) {
                prev.deepsearch--;
              }
              return prev;
            });
          } else {
            setLimit((prev) => {
              if (prev.regular > 0) {
                prev.regular--;
              }
              return prev;
            });
          }
        }
      } else {
        count--;
      }
    }
    if (count == 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void = (
    e
  ) => {
    const values: string[] = e.currentTarget.value.split(",");
    let count = values.length;
    for (const string of values) {
      const str = string.trim();
      if (!cache.search(str)) {
        if (urlPattern.test(str)) {
          cache.insert(str);
          count--;
          if (isSetToMultiSearch) {
            setLimit((prev) => {
              if (prev.deepsearch > 0) {
                prev.deepsearch--;
              }
              return prev;
            });
          } else {
            setLimit((prev) => {
              if (prev.regular > 0) {
                prev.regular--;
              }
              return prev;
            });
          }
        }
      } else {
        count--;
      }
    }
    if (count == 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
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
          setMode={SetIsSetToMultiSearch}
        />
      </Grid>
    </Layout>
  );
};

export default IndexPage;

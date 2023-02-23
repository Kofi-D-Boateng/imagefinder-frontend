import { ArrowOutward, Download } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Checkbox,
  Tooltip,
  Typography,
  useTheme,
  Theme,
  useMediaQuery,
} from "@mui/material";
import sadFace from "../../assets/Sad-Face-Emoji.png";
import { DownloadType } from "enums/Download";
import { FC, useRef, useState } from "react";
import { ImageMap, UrlImageMap } from "../../interfaces/ImageMap";
import Layout from "../ui/Layout";
import {
  addRemoveHandler,
  downloadHandler,
  redirectHandler,
  toggleHandler,
} from "./functions/ResultFunctions";
import { Action } from "enums/Action";

const Results: FC<{
  results: UrlImageMap<string, string>;
  classes: {
    readonly [key: string]: string;
  };
}> = ({ results, classes }) => {
  const theme = useTheme<Theme>();
  const isMobile: boolean = useMediaQuery<unknown>(
    theme.breakpoints.down("md")
  );
  const [multiSelect, setMultiSelect] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [amount, setAmount] = useState<{ [key: string]: number }>({});
  const downloadableSet = useRef<Map<string, Set<string>>>(new Map());
  const sx = { val: 160, fit: "crop", auto: "format" };
  const r = Object.keys(results);

  return (
    <Layout title="Results">
      <Grid
        className={!isMobile ? classes.resultGrid : classes.resultGridMobile}
        container
      >
        {r.map((key: string, i: number) => {
          const innerMap: ImageMap<string, string> = results[key];
          const innerKeys = Object.keys(innerMap);
          const entryCount = Object.entries(innerMap).length;

          return (
            <Grid
              key={i}
              sx={{ margin: "20px auto" }}
              xs={12}
              md={r.length > 2 ? 4 : 6}
              item
            >
              <Card className={classes.card}>
                <CardHeader
                  className={classes.header}
                  title={key}
                  titleTypographyProps={{
                    fontSize: "1rem",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                  subheader={`Number of images found: ${
                    entryCount > 0 ? innerMap[innerKeys.at(0)]?.length : 0
                  }`}
                  subheaderTypographyProps={{
                    fontSize: "1rem",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                />

                <CardMedia>
                  {innerMap && innerMap[innerKeys.at(0)]?.length > 0 ? (
                    <ImageList key={key} className={classes.media} cols={3}>
                      {innerKeys
                        .map((key) => innerMap[key])[0]
                        .map((img, i) => (
                          <ImageListItem key={i}>
                            <img
                              src={`${img}?w=${sx.val}&h=${sx.val}&fit=${sx.fit}&auto=${sx.auto}`}
                              srcSet={`${img}?w=${sx.val}&h=${sx.val}&fit=${sx.fit}&auto=${sx.auto}&dpr=2 2x`}
                              alt="photo.png"
                              loading="lazy"
                            />
                            <ImageListItemBar
                              title={"Image"}
                              actionIcon={
                                <>
                                  {!multiSelect[key] ? (
                                    <Tooltip title="Download">
                                      <IconButton
                                        sx={{
                                          color: "rgba(255, 255, 255, 0.54)",
                                        }}
                                        aria-label={`download image`}
                                        onClick={() =>
                                          downloadHandler(
                                            DownloadType.SINGLE,
                                            null,
                                            img
                                          )
                                        }
                                      >
                                        <Download />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Toggle Select">
                                      <Checkbox
                                        sx={{
                                          color: "rgba(255, 255, 255, 0.54)",
                                        }}
                                        aria-label={`select image`}
                                        name="toggle-select"
                                        onChange={(e) =>
                                          addRemoveHandler(
                                            key,
                                            img,
                                            downloadableSet.current,
                                            setAmount,
                                            e.target.checked
                                              ? Action.ADD
                                              : Action.REMOVE
                                          )
                                        }
                                      />
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Redirect to image">
                                    <IconButton
                                      sx={{
                                        color: "rgba(255, 255, 255, 0.54)",
                                      }}
                                      aria-label={`redirect to image`}
                                      onClick={(e) => redirectHandler(e, img)}
                                    >
                                      <ArrowOutward />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              }
                            />
                          </ImageListItem>
                        ))}
                    </ImageList>
                  ) : (
                    <Grid container>
                      <img
                        className={classes.nonFound}
                        src={sadFace.src}
                        alt="sadFace.png"
                      />
                    </Grid>
                  )}
                </CardMedia>
                <Grid container>
                  <Grid
                    className={classes.downloadBtn}
                    aria-label={
                      !multiSelect[key] ? "bulk download" : "selected download"
                    }
                    onClick={(e) =>
                      !multiSelect[key]
                        ? downloadHandler(DownloadType.BULK, results, "", key)
                        : downloadHandler(
                            DownloadType.SELECTED,
                            downloadableSet.current,
                            "",
                            key
                          )
                    }
                    xs={6}
                    md={6}
                    item
                  >
                    <Typography variant="h5">
                      {!multiSelect[key]
                        ? "Bulk Download"
                        : `Download ${amount[key]} photos`}
                    </Typography>
                  </Grid>
                  <Grid
                    className={
                      !multiSelect[key] ? classes.selectBtn : classes.cancelBtn
                    }
                    aria-label={
                      !multiSelect[key] ? "select photos" : "cancel photos"
                    }
                    data-name={key}
                    onClick={(e) => toggleHandler(e, setMultiSelect, setAmount)}
                    xs={6}
                    md={6}
                    item
                  >
                    <Typography variant="h5">
                      {!multiSelect[key] ? "Select Photos" : "Cancel Selection"}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Layout>
  );
};

export default Results;

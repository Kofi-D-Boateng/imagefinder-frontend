import { ArrowOutward, Download } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { randomBytes } from "crypto";
import { DownloadType } from "enums/Download";
import { FC, MouseEvent, useRef, useState } from "react";
import { UrlImageMap } from "../../interfaces/ImageMap";
import Layout from "../Layout";
import { addRemoveHandler, downloadHandler } from "./functions/ResultFunctions";

const Results: FC<{
  results: UrlImageMap<string, string>;
  classes: {
    readonly [key: string]: string;
  };
}> = ({ results, classes }) => {
  const [multiSelect, setMultiSelect] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [amount, setAmount] = useState<{ [key: string]: number }>({});
  const downloadableSet = useRef<Map<string, Set<string>>>(new Map());
  const sx = { val: 160, fit: "crop", auto: "format" };
  const r = Object.keys(results);
  const toggleHandler: (event: MouseEvent<HTMLButtonElement>) => void = (e) => {
    const { name } = e.currentTarget;
    if (!name) return;
    const n = multiSelect;
    const a = amount;
    if (multiSelect[name]) {
      delete n[name];
      delete a[name];
      setMultiSelect({ ...n });
      setAmount({ ...a });
    } else {
      n[name] = true;
      a[name] = 0;
      setMultiSelect({ ...n });
      setAmount({ ...a });
    }
  };

  return (
    <Layout title="Results">
      <Grid container>
        {r.map((key: string, i: number) => {
          return (
            <Grid key={i} xs={12} md={12 / r.length} item>
              <Card className={classes.card}>
                <CardHeader
                  className={classes.header}
                  title={key}
                  subheader={`Number of images found: ${
                    Object.values(results[key])[0]
                      ? Object.values(results[key])[0].length
                      : 0
                  }`}
                />

                <CardMedia>
                  <ImageList key={key} className={classes.media} cols={3}>
                    {Object.values(results[key])[0] ? (
                      Object.values(results[key])[0].map((img, i) => (
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
                                      onClick={(e) =>
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
                                      onClick={() =>
                                        addRemoveHandler(
                                          key,
                                          img,
                                          downloadableSet.current,
                                          setAmount
                                        )
                                      }
                                    />
                                  </Tooltip>
                                )}
                                <Tooltip title="Redirect to image">
                                  <IconButton
                                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                    aria-label={`redirect to image`}
                                  >
                                    <ArrowOutward />
                                  </IconButton>
                                </Tooltip>
                              </>
                            }
                          />
                        </ImageListItem>
                      ))
                    ) : (
                      <ImageListItem></ImageListItem>
                    )}
                  </ImageList>
                </CardMedia>
                <Grid container>
                  <Grid xs={6} md={6} item>
                    {!multiSelect[key] ? (
                      <Button
                        aria-label="bulk download"
                        variant="outlined"
                        className={classes.downloadBtn}
                        type="button"
                        name={key}
                        onClick={(e) =>
                          downloadHandler(DownloadType.BULK, results)
                        }
                        fullWidth
                      >
                        Bulk Download
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        className={classes.downloadBtn}
                        type="button"
                        name={key}
                        onClick={(e) =>
                          downloadHandler(
                            DownloadType.SELECTED,
                            downloadableSet.current
                          )
                        }
                        fullWidth
                      >
                        {`Download ${amount[key]} photos`}
                      </Button>
                    )}
                  </Grid>
                  <Grid xs={6} md={6} item>
                    {!multiSelect[key] ? (
                      <Button
                        aria-label="select photos"
                        variant="outlined"
                        className={classes.selectBtn}
                        type="button"
                        name={key}
                        onClick={toggleHandler}
                        fullWidth
                      >
                        Select Photos
                      </Button>
                    ) : (
                      <Button
                        aria-label="cancel photos"
                        variant="outlined"
                        className={classes.cancelBtn}
                        type="button"
                        name={key}
                        onClick={toggleHandler}
                        fullWidth
                      >
                        Cancel Selection
                      </Button>
                    )}
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

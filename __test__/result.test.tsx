import { render, screen, waitFor } from "@testing-library/react";
import router from "next-router-mock";
import "@testing-library/jest-dom";
import { SearchType } from "enums/Search";
import Results from "@/components/result/Results";
import { ImageMap, UrlImageMap } from "interfaces/ImageMap";
import { sampleImgs } from "./utils/resources";
import userEvent from "@testing-library/user-event";

describe("Results Test Suite", () => {
  test("Select a Photo", async () => {
    // const props = {
    //   q: "http://testurl1.com,https://testurl2.com",
    //   style: SearchType.VERBOSE,
    // };
    // router.push({
    //   pathname: "/search",
    //   query: {
    //     q: props.q,
    //     style: props.style,
    //   },
    // });
    // const map: UrlImageMap<string, string> = {};
    // props.q.split(",").forEach((s, i) => {
    //   const innerMap: ImageMap<string, string> = {};
    //   innerMap["img"] =
    //     sampleImgs[i < sampleImgs.length ? i : sampleImgs.length];
    //   map[s] = innerMap;
    // });
    // render(<Results classes={{}} results={map} />);
    // const photoDocs = await waitFor(() =>
    //   screen.findAllByText(/http/i, { exact: true })
    // );
    // waitFor(() => expect(photoDocs.length).toBe(2));
    // const selectBtns = await waitFor(() =>
    //   screen.findAllByRole("button", { name: "select photos" })
    // );
    // selectBtns.forEach((btn) => expect(btn).toBeInTheDocument());
    // waitFor(() => userEvent.click(selectBtns[0]));
    // const btn = await waitFor(() =>
    //   screen.findByRole("checkbox", { name: "select image", exact: false })
    // );
    // expect(btn).toBeInTheDocument();
    // userEvent.click(btn);
  });
});

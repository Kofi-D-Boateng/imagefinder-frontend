import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import router from "next-router-mock";
import "@testing-library/jest-dom";
import { SearchType } from "enums/Search";
import ResultPage from "pages/search";

const props = {
  q: "http://testurl1.com,https://testurl2.com",
  style: SearchType.VERBOSE,
};

describe("Search Test Suite", () => {
  beforeAll(() =>
    router.push({
      pathname: "/search",
      query: {
        q: props.q,
        style: props.style,
      },
    })
  );
  test("Makes call to API", async () => {
    render(<ResultPage q={props.q} style={props.style} />);
  });
});

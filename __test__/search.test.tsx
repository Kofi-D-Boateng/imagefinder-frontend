import { render, screen, waitFor } from "@testing-library/react";
import router from "next-router-mock";
import "@testing-library/jest-dom";
import { SearchType } from "enums/Search";
import ResultPage from "pages/search";

describe("Search Test Suite", () => {
  test("Successful Search", async () => {
    const props = {
      q: "http://testurl1.com,https://testurl2.com",
      style: SearchType.VERBOSE,
    };
    router.push({
      pathname: "/search",
      query: {
        q: props.q,
        style: props.style,
      },
    });
    render(<ResultPage q={props.q} style={props.style} />);
    const photoDocs = await waitFor(() =>
      screen.findAllByText(/http/i, { exact: true })
    );
    expect(photoDocs.length).toBe(2);
  });

  test("Unsuccessful Search", async () => {
    const props = {
      q: undefined,
      style: SearchType.VERBOSE,
    };
    router.push({
      pathname: "/search",
      query: {
        q: props.q,
        style: props.style,
      },
    });
    render(<ResultPage q={props.q} style={props.style} />);
    const textMatch = await waitFor(() =>
      screen.findByText(/Get a bite to eat, while we grab what you need!/i, {
        exact: true,
      })
    );

    waitFor(() => expect(textMatch).toBeInTheDocument());
    setTimeout(() => {
      waitFor(() => expect(textMatch).not.toBeInTheDocument());
    }, 5000);
  });
});

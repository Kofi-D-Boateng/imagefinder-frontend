import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IndexPage from "pages";
import "@testing-library/jest-dom";

jest.mock("next/router", () => require("next-router-mock"));

describe("Homepage Test Suite", () => {
  test("Loads homepage", async () => {
    render(<IndexPage />);
    const textMatch = await waitFor(() =>
      screen.findByText(/Deep Search/i, { exact: false })
    );
    expect(textMatch).toBeInTheDocument();
  });

  test("Blocking condition is active on search button", async () => {
    render(<IndexPage />);
    const submitButton = await waitFor(() => screen.findByRole("button"));
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);
    expect(submitButton).toBeInTheDocument();
  });

  test("Removal of restrictions when url is correct", async () => {
    render(<IndexPage />);
    const textField = await waitFor(() =>
      screen.findByPlaceholderText(/Search Images on ImageFinder/i, {
        exact: true,
      })
    );
    const criteriaText = await waitFor(() =>
      screen.findAllByText(/Urls must /i, { exact: true })
    );
    for (const element of criteriaText) expect(element).toBeInTheDocument();
    expect(textField).toBeInTheDocument();
    await userEvent.click(textField);
    await userEvent.type(textField, "http://testurl.com", { delay: 1 });
    userEvent.click(criteriaText[0]);
    for (const element of criteriaText) expect(element).not.toBeInTheDocument();
  });
});

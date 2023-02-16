import "@testing-library/jest-dom/extend-expect";
import { server } from "./__test__/utils/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

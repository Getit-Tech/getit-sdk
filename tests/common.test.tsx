import { render } from "@testing-library/react";
import "jest-canvas-mock";
import { GetitAdPlugin } from "../src";

describe("Common render", () => {
  it("renders without crashing", () => {
    render(
      //@ts-ignore
      <GetitAdPlugin apiKey='' isMobile={false} walletConnected='' slotId='1' />,
    );
  });
});

import "@testing-library/jest-dom/extend-expect";

import * as stories from "stories/20-SideMenu/00-BoardsMenuSection.stories";

import { EmptySectionProps, LoadingSectionProps } from "sidemenu/BoardsMenuSection";
import {
  Screen,
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import React from "react";
import { action } from "@storybook/addon-actions";
import { composeStories } from "@storybook/testing-react";
import { mocked } from "ts-jest/utils";
import userEvent from "@testing-library/user-event";

jest.mock("@storybook/addon-actions");

const { Regular, Empty, Loading, } = composeStories(stories);

describe("Regular", () => {
  test("Renders section with board menu items", async () => {
    render(<Regular />);
  
    //TODO: fill this
  });
  
  test("Board menu items link to boards", async () => {
    render(<Regular />);
  
    //TODO: fill this
  });
  
  test("Correctly renders board without updates", async () => {
    render(<Regular />);
    
    expect(screen.getByRole("link", { name: "oncie-den"})).toHaveTextContent("!oncie-den");
  });
  
  test("Correctly marks boards with updates", async () => {
    render(<Regular />);
  
    expect(screen.getByLabelText("gore has new updates")).toHaveTextContent("!gore");
  });
  
  test("Correctly marks outdated boards with updates", async () => {
    render(<Regular />);
  
    expect(screen.getByLabelText("crack has updates")).toHaveTextContent("!crack");
  });
  
  test("Correctly marks current board", async () => {
    render(<Regular />);
  
    expect(screen.getByRole("link", { current: "page" })).toHaveTextContent("!kink-memes");
  });

  test("Correctly marks muted board", async () => {
    render(<Regular />);
  
    expect(screen.getByLabelText("anime muted")).toHaveTextContent("!anime");
  });
});

describe("Empty", () => {
  test("Renders empty section", async () => {
    render(<Empty />);
    
    // This might be overkill?
    expect(screen.getByText((Empty.args as EmptySectionProps).title)).toBeVisible;
    expect(screen.getByText((Empty.args as EmptySectionProps).emptyTitle)).toBeVisible;
    expect(screen.getByText((Empty.args as EmptySectionProps).emptyDescription)).toBeVisible;
  });
});

describe("Loading", () => {
  test("Renders loading section", async () => {
    render(<Loading />);
    
    
    expect(screen.getByText((Loading.args as LoadingSectionProps).title)).toBeVisible;
  });
});






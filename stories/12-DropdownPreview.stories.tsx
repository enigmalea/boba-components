import React from "react";
import DropdownListMenu from "../src/common/DropdownListMenu";
import Button from "../src/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faMapPin,
  faVolumeMute,
  faBellSlash,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";
import { action } from "@storybook/addon-actions";

export default {
  title: "Dopdown Preview",
  component: DropdownListMenu,
};

export const ClassicDropdownStory = () => {
  return (
    <div style={{ width: "500px", backgroundColor: "white", padding: "15px" }}>
      <DropdownListMenu
        options={[
          {
            name: "Pin board",
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Mute board",
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Dismiss notifications",
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Customize Summary",
            link: {
              onClick: action("noHrefClick"),
            },
          },
        ]}
        zIndex={51}
      >
        <Button>Click me!</Button>
      </DropdownListMenu>
    </div>
  );
};

ClassicDropdownStory.story = {
  name: "classic",
};

export const IconDropwdownStory = () => {
  return (
    <div style={{ width: "500px", backgroundColor: "white", padding: "15px" }}>
      <DropdownListMenu
        options={[
          {
            name: "Pin board",
            icon: faMapPin,
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Mute board",
            icon: faVolumeMute,
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Dismiss notifications",
            icon: faBellSlash,
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Customize Summary",
            icon: faPaintBrush,
            link: {
              onClick: action("noHrefClick"),
            },
          },
        ]}
        zIndex={51}
      >
        <FontAwesomeIcon icon={faCaretDown} />
      </DropdownListMenu>
    </div>
  );
};

IconDropwdownStory.story = {
  name: "icon",
};

export const MultipleDropdowns = () => {
  return (
    <div style={{ width: "500px", backgroundColor: "white", padding: "15px" }}>
      <DropdownListMenu
        options={[
          {
            name: "Pin board",
            icon: faMapPin,
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Inner Options",
            icon: faVolumeMute,
            options: [
              {
                name: "Inner Option 1",
                icon: faBellSlash,
                link: {
                  onClick: action("noHrefClick"),
                },
              },
              {
                name: "Inner Option 2",
                icon: faPaintBrush,
                options: [
                  {
                    name: "Inner Option 21",
                    icon: faBellSlash,
                    link: {
                      onClick: action("noHrefClick"),
                    },
                  },
                  {
                    name: "Inner Option 22",
                    icon: faPaintBrush,
                    link: {
                      onClick: action("noHrefClick"),
                    },
                  },
                  {
                    name: "Inner Option 23",
                    icon: faPaintBrush,
                    link: {
                      onClick: action("noHrefClick"),
                    },
                  },
                  {
                    name: "Inner Option 2424242424242424242424",
                    icon: faPaintBrush,
                    link: {
                      onClick: action("noHrefClick"),
                    },
                  },
                ],
              },
            ],
          },
          {
            name: "Dismiss notifications",
            icon: faBellSlash,
            link: {
              onClick: action("noHrefClick"),
            },
          },
          {
            name: "Customize Summary",
            icon: faPaintBrush,
            link: {
              onClick: action("noHrefClick"),
            },
          },
        ]}
        zIndex={51}
      >
        <FontAwesomeIcon icon={faCaretDown} />
      </DropdownListMenu>
    </div>
  );
};

MultipleDropdowns.story = {
  name: "multiple",
};

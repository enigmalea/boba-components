import React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { LinkWithAction } from "types";
import { useBackdrop } from "../utils";

import Tooltip from "./Tooltip";
import Theme from "../theme/default";
import ReactDOM from "react-dom";
import Color from "color";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export enum DropdownStyle {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export interface DropdownProps {
  children: JSX.Element;
  // If Options are empty, children is simply returned.
  options?: ({
    name: string;
    icon?: IconDefinition;
  } & ({ link: LinkWithAction } | { options: DropdownProps["options"] }))[];
  style?: DropdownStyle;
  accentColor?: string;
  zIndex?: number;
}

const isSmallScreen = () => {
  return typeof matchMedia === "undefined"
    ? false
    : matchMedia("only screen and (max-width: 575px)").matches;
};

const DropdownContent = React.forwardRef<
  HTMLDivElement,
  DropdownProps & {
    isOpen: boolean;
    onCloseRequest: () => void;
    onNestedOptions: (options: DropdownProps["options"]) => void;
    onPreviousOption: () => void;
    isNested: boolean;
    width?: string;
  }
>((props, ref) => {
  const themeColor =
    DropdownStyle.DARK == props.style
      ? Theme.DROPDOWN_BACKGROUND_COLOR_DARK
      : Theme.DROPDOWN_BACKGROUND_COLOR_LIGHT;
  const reverseThemeColor =
    DropdownStyle.DARK == props.style
      ? Theme.DROPDOWN_BACKGROUND_COLOR_LIGHT
      : Theme.DROPDOWN_BACKGROUND_COLOR_DARK;
  const hoverBackgroundColor =
    DropdownStyle.DARK == props.style
      ? Color(themeColor).lighten(0.85).hex()
      : Color(themeColor).darken(0.15).hex();
  return (
    <div className={classnames("menu")} ref={ref}>
      {props.isNested && (
        <button
          className="back option"
          onClick={props.onPreviousOption}
          key="prev-option"
        >
          <span className="popover-icon">
            <FontAwesomeIcon icon={faChevronLeft} />
          </span>
          back
        </button>
      )}
      {props.options?.map((option) => (
        // TODO: this should be a button if there's no href.
        <a
          key={option.name}
          className={classnames("option", {
            nested: "options" in option,
          })}
          onClick={(e) => {
            e.preventDefault();
            if ("options" in option) {
              props.onNestedOptions(option.options);
              return;
            }
            option.link.onClick?.();
            props.onCloseRequest();
          }}
          href={option["link"]?.href || "#none"}
        >
          {!!option.icon && (
            <span className="popover-icon">
              <FontAwesomeIcon icon={option.icon} />
            </span>
          )}
          <span className="option-text">{option.name}</span>
          <span className="nested-icon">
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
        </a>
      ))}
      <style jsx>{`
        .menu {
          min-width: 250px;
          color: ${reverseThemeColor};
          text-align: left;
          flex-shrink: 0;
          padding: 5px;
        }
        .back.option {
          border: none;
          background-color: transparent;
          font-family: inherit;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        .option {
          border-radius: 5px;
          padding: 8px;
          display: block;
          color: ${reverseThemeColor};
          text-decoration: none;
          white-space: nowrap;
        }
        .option:hover {
          background-color: ${hoverBackgroundColor};
          cursor: pointer;
        }
        .nested {
          display: flex;
          justify-content: space-between;
        }
        .nested .option-text {
          flex-grow: 1;
        }
        .nested-icon {
          display: none;
        }
        .nested .nested-icon {
          width: 16px;
          height: 22px;
          display: inline-block;
          opacity: 0.6;
        }
        .popover-icon {
          margin-right: 12px;
          width: 16px;
          height: 22px;
          display: inline-block;
          text-align: center;
        }

        @media only screen and (max-width: 575px) {
          .menu {
            background-color: ${themeColor};
            width: calc(100% - 10px);
          }
          .popover-icon {
            margin-right: 12px;
          }
          .option,
          .back.option {
            padding: 12px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
});

const getMenuOffsetInSlider = (refs: {
  menuRef?: React.RefObject<HTMLDivElement>;
  sliderRef: HTMLDivElement;
}) => {
  const currentMenuRect = refs.menuRef?.current?.getBoundingClientRect();
  const containerRect = refs.sliderRef.getBoundingClientRect();
  return (currentMenuRect?.x || 0) - (containerRect?.x || 0);
};

const DropdownMenu: React.FC<DropdownProps> = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const { setOpen: setBackdropOpen } = useBackdrop({
    id: "dropdown",
    zIndex: 101,
    onClick: () => {
      setOpen(false);
    },
  });
  const [optionsStack, setOptionsStack] = React.useState<
    {
      ref: React.RefObject<HTMLDivElement>;
      options: DropdownProps["options"];
    }[]
  >([
    {
      ref: React.createRef<HTMLDivElement>(),
      options: props.options,
    },
  ]);
  // We use states for this cause refs don't cause a re-render on dom update
  const [
    optionsWrapper,
    setOptionsWrapper,
  ] = React.useState<HTMLDivElement | null>(null);
  const [
    optionsSlider,
    setOptionsSlider,
  ] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen && isSmallScreen()) {
      setBackdropOpen(true);
    } else {
      setBackdropOpen(false);
    }
  }, [isOpen]);

  if (!props.options) {
    return props.children;
  }

  const themeColor =
    DropdownStyle.DARK == props.style
      ? Theme.DROPDOWN_BACKGROUND_COLOR_DARK
      : Theme.DROPDOWN_BACKGROUND_COLOR_LIGHT;

  const content = optionsStack.map(({ options, ref }, index) => (
    <DropdownContent
      {...props}
      ref={ref}
      key={index}
      options={options}
      isOpen={isOpen}
      isNested={index > 0}
      width={
        isSmallScreen()
          ? (optionsWrapper?.getBoundingClientRect().width || 0) + "px"
          : undefined
      }
      onPreviousOption={() => {
        if (!optionsWrapper || !optionsSlider) {
          return;
        }
        const previousMenuRect = optionsStack[
          optionsStack.length - 2
        ].ref.current?.getBoundingClientRect();
        if (!isSmallScreen()) {
          optionsWrapper.style.width = (previousMenuRect?.width || 0) + "px";
        }
        optionsWrapper.style.height = (previousMenuRect?.height || 0) + "px";

        optionsSlider.style.left =
          -getMenuOffsetInSlider({
            menuRef: optionsStack[optionsStack.length - 2].ref,
            sliderRef: optionsSlider,
          }) + "px";
        optionsSlider.addEventListener(
          "transitionend",
          () => {
            setOptionsStack(optionsStack.slice(0, optionsStack.length - 1));
          },
          { once: true }
        );
      }}
      onCloseRequest={() => {
        setOpen(false);
      }}
      onNestedOptions={(options) => {
        setOptionsStack([...optionsStack, { ref: React.createRef(), options }]);
      }}
    />
  ));
  React.useLayoutEffect(() => {
    if (
      !optionsWrapper ||
      !optionsSlider ||
      !isOpen ||
      optionsStack.length < 1
    ) {
      return;
    }
    //debugger;
    const currentMenuRect = optionsStack[
      optionsStack.length - 1
    ].ref.current?.getBoundingClientRect();
    optionsWrapper.style.height = (currentMenuRect?.height || 0) + "px";
    if (!isSmallScreen()) {
      optionsWrapper.style.width = (currentMenuRect?.width || 0) + "px";
    } else {
      optionsSlider.style.width =
        optionsWrapper.getBoundingClientRect().width + "px";
    }
    // Only turn it in absolute when we're effectively in a multistack situation
    // so we don't interfere with the popover operation.
    optionsSlider.style.position = "absolute";
    optionsSlider.style.left =
      -getMenuOffsetInSlider({
        menuRef: optionsStack[optionsStack.length - 1].ref,
        sliderRef: optionsSlider,
      }) + "px";
  }, [optionsStack, optionsWrapper, optionsSlider]);

  React.useEffect(() => {
    if (!isOpen) {
      if (!optionsWrapper || !optionsSlider) {
        return;
      }
      optionsSlider.style.position = "relative";
      optionsSlider.style.left = "0px";
      optionsWrapper.style.width = "auto";
      optionsWrapper.style.height = "auto";
      setOptionsStack([optionsStack[0]]);
    }
  }, [isOpen]);

  return (
    <>
      <Tooltip
        isOpen={isOpen && !isSmallScreen()}
        position="bottom"
        content={
          isOpen ? (
            <div
              className="content-wrapper"
              ref={(ref) => setOptionsWrapper(ref)}
            >
              <div
                className="content-slider"
                ref={(ref) => setOptionsSlider(ref)}
              >
                {content}
              </div>
            </div>
          ) : (
            <div />
          )
        }
        padding={0}
        zIndex={props.zIndex}
        onClickOutside={() => setOpen(false)}
        background={themeColor}
        border={{ width: "2px", radius: "5px" }}
      >
        <button
          className={classnames("button-wrapper", {
            "with-options": props.options,
          })}
          tabIndex={0}
          onClick={() => setOpen(!isOpen)}
        >
          {props.children}
        </button>
      </Tooltip>
      {isSmallScreen() &&
        ReactDOM.createPortal(
          <div className={classnames("portal-content", { visible: isOpen })}>
            <div
              className="content-wrapper"
              ref={(ref) => setOptionsWrapper(ref)}
            >
              <div
                className="content-slider"
                ref={(ref) => setOptionsSlider(ref)}
              >
                {content}
              </div>
            </div>
          </div>,
          document.body
        )}
      <style jsx>{`
        .portal-content {
          display: none;
        }
        .portal-content.visible {
          display: block;
        }
        .content-wrapper {
          overflow: hidden;
          min-width: 30px;
          min-height: 30px;
          transition: all 0.2s ease-out;
        }
        .content-slider {
          display: flex;
          align-items: flex-start;
          transition: left 0.2s ease-out;
          left: 0;
        }
        .button-wrapper {
          background: none;
          border: none;
          padding: 0;
          text-align: inherit;
        }
        .wrapper:focus {
          outline: none;
        }
        .wrapper.with-options:hover {
          cursor: pointer;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0%);
          }
        }
        @media only screen and (max-width: 575px) {
          .portal-content {
            overflow: hidden;
            background-color: ${themeColor};
            border-radius: 5px 5px 0px 0px;
            width: 95%;
            position: fixed;
            left: 50%;
            bottom: 0;
            transform: translate(-50%, 0%);
            animation-name: slideUp;
            animation-duration: 0.2s;
            border: 1px solid blue;
            z-index: 102;
          }
          .content-slider {
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
};

export default DropdownMenu;

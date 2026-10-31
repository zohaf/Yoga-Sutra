"use client";

import { Children, isValidElement } from "react";
import type { FC, ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type SubComponent = {
  Header: typeof Header;
  Body: typeof Body;
};

const hasDisplayName = (child: ReactNode, name: string) =>
  isValidElement(child) &&
  typeof child.type !== "string" &&
  (child.type as { displayName?: string }).displayName === name;

export const Accordion: FC<{ children: ReactNode }> & SubComponent = ({
  children,
  ...restProps
}) => {
  const header = Children.map(children, (child) =>
    hasDisplayName(child, "Header") ? child : null,
  );
  const body = Children.map(children, (child) =>
    hasDisplayName(child, "Body") ? child : null,
  );

  const [animateParent] = useAutoAnimate();
  return (
    <div ref={animateParent} {...restProps} className="flex flex-col">
      {header}
      {body}
    </div>
  );
};

const Header: FC<{
  title: string;
  onClick: () => void;
  expanded: boolean;
  controls: string;
}> = ({ title, onClick, expanded, controls }) => (
  <h1 className="font-extrabold text-xl">
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      className="flex justify-end w-full py-2 cursor-pointer font-extrabold text-xl"
    >
      {title}
    </button>
  </h1>
);

const Body: FC<{ id: string; children: ReactNode }> = ({ id, children }) => (
  <div id={id}>{children}</div>
);

Header.displayName = "Header";
Body.displayName = "Body";
Accordion.Header = Header;
Accordion.Body = Body;

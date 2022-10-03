import { Children } from "react";
import type { FC, ReactNode } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type SubComponent = {
  Header: typeof Header;
  Body: typeof Body;
};

export const Accordion: FC<{ children: ReactNode }> & SubComponent = ({
  children,
  ...restProps
}) => {
  const header = Children.map(children, (child) => {
    return child?.type.displayName === "Header" ? child : null;
  });
  const body = Children.map(children, (child) => {
    return child?.type.displayName === "Body" ? child : null;
  });

  const [animateParent] = useAutoAnimate();
  return (
    <div ref={animateParent} {...restProps} className="flex flex-col">
      {header}
      {body}
    </div>
  );
};

const Header: FC<{ title: string; onClick: () => void }> = ({
  title,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="flex justify-between w-full py-2 cursor-pointer font-extrabold text-xl"
  >
    <div />
    <h1>{title}</h1>
  </div>
);

const Body: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

Header.displayName = "Header";
Body.displayName = "Body";
Accordion.Header = Header;
Accordion.Body = Body;

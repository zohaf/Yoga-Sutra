import React from "react";
import type { FC } from "react";
import { ReactNode } from "react";

type ContainerPropps = {
  children: ReactNode;
};

export const Container: FC<ContainerPropps> = ({ children }) => {
  return <div className="flex justify-center m-auto">{children}</div>;
};

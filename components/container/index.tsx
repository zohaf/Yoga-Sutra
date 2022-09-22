import React from "react";
import type { FC } from "react";
import { ReactNode } from "react";

type ContainerPropps = {
  children: ReactNode;
};

export const Container: FC<ContainerPropps> = ({ children }) => (
  <div className="flex flex-col mx-auto mt-5">{children}</div>
);

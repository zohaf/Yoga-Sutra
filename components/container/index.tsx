import React from "react";
import type { FC } from "react";
import { ReactNode } from "react";

type ContainerPropps = {
  children: ReactNode;
};

export const Container: FC<ContainerPropps> = ({ children }) => (
  <div className="flex flex-col mx-3 sm:mx-auto mt-28 min-w-fit max-w-4xl">
    {children}
  </div>
);

import React from "react";
import type { FC } from "react";
import { ReactNode } from "react";

type SidePanelPropps = {
  children: ReactNode;
};

export const SidePanel: FC<SidePanelPropps> = ({ children }) => (
  <div className="px-10">{children}</div>
);

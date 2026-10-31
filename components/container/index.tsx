import type { FC, ReactNode } from "react";
import styles from "./Container.module.css";

export const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <main className={styles.container}>{children}</main>
);

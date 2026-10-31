import type { FC, ReactNode } from "react";
import styles from "./Accordion.module.css";

type SubComponent = {
  Header: typeof Header;
  Body: typeof Body;
};

export const Accordion: FC<{ children: ReactNode }> & SubComponent = ({
  children,
}) => <div className={styles.accordion}>{children}</div>;

const Header: FC<{
  title: string;
  onClick: () => void;
  expanded: boolean;
  controls: string;
}> = ({ title, onClick, expanded, controls }) => (
  <h2 className={styles.heading}>
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      className={styles.trigger}
    >
      {title}
    </button>
  </h2>
);

/** Always rendered so opening and closing can animate; `inert` while closed. */
const Body: FC<{ id: string; open: boolean; children: ReactNode }> = ({
  id,
  open,
  children,
}) => (
  <div id={id} className={styles.panel} data-open={open} inert={!open}>
    <div className={styles.panelInner}>
      <div className={styles.content}>{children}</div>
    </div>
  </div>
);

Accordion.Header = Header;
Accordion.Body = Body;

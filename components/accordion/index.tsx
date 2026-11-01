"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FC, ReactNode } from "react";
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

/**
 * Content height, in viewport heights, that the base expand duration is tuned
 * for (the first chapter on desktop). Taller content gets a proportionally
 * longer transition, so the part on screen always moves at the same speed.
 */
const REFERENCE_VIEWPORTS = 0.5;

const useDurationScale = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const reference = window.innerHeight * REFERENCE_VIEWPORTS;
      setScale(Math.max(1, element.offsetHeight / reference));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return [ref, scale] as const;
};

/** Always rendered so opening and closing can animate; `inert` while closed. */
const Body: FC<{ id: string; open: boolean; children: ReactNode }> = ({
  id,
  open,
  children,
}) => {
  const [contentRef, scale] = useDurationScale();

  return (
    <div
      id={id}
      className={styles.panel}
      data-open={open}
      inert={!open}
      style={{ "--panel-duration-scale": scale } as CSSProperties}
    >
      <div className={styles.panelInner}>
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

Accordion.Header = Header;
Accordion.Body = Body;

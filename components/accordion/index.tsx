"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FC, ReactNode, RefObject } from "react";
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
 * longer closing transition, so the part on screen moves at the same speed.
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

const readDuration = (element: Element, token: string) => {
  const value = getComputedStyle(element).getPropertyValue(token).trim();
  return value.endsWith("ms") ? parseFloat(value) : parseFloat(value) * 1000;
};

/**
 * Viewport height left below the panel's top once any panel above it has
 * finished closing (opening one chapter closes the open one).
 */
const visibleSpaceBelow = (panel: HTMLElement) => {
  const closingAbove = [...document.querySelectorAll(`.${styles.panel}`)]
    .filter(
      (other) =>
        other !== panel &&
        other.getAttribute("data-open") === "false" &&
        other.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING,
    )
    .reduce((sum, other) => sum + other.getBoundingClientRect().height, 0);
  const top = Math.max(0, panel.getBoundingClientRect().top - closingAbove);
  return window.innerHeight - top;
};

/**
 * Opening animates only the part that fits on screen: max-height from 0 to
 * min(panel, space below it) with the base expand duration. A CSS transition to
 * the full height would spend its gentle deceleration below the fold, so a
 * tall chapter would appear to open at once. The rest appears off screen
 * when the animation ends.
 */
const useOpenAnimation = (
  open: boolean,
  panelRef: RefObject<HTMLDivElement | null>,
) => {
  const wasOpen = useRef(open);

  useEffect(() => {
    const opening = open && !wasOpen.current;
    wasOpen.current = open;
    const panel = panelRef.current;
    if (!opening || !panel || !panel.animate) return;

    const duration = readDuration(panel, "--motion-duration-expand");
    if (!duration) return;
    const easing = getComputedStyle(panel)
      .getPropertyValue("--motion-easing-soft")
      .trim();
    const target = Math.min(panel.scrollHeight, visibleSpaceBelow(panel));
    const animation = panel.animate(
      [{ maxHeight: "0px" }, { maxHeight: `${target}px` }],
      { duration, easing },
    );
    return () => animation.cancel();
  }, [open, panelRef]);
};

/** Always rendered so opening and closing can animate; `inert` while closed. */
const Body: FC<{ id: string; open: boolean; children: ReactNode }> = ({
  id,
  open,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [contentRef, scale] = useDurationScale();
  useOpenAnimation(open, panelRef);

  return (
    <div
      ref={panelRef}
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

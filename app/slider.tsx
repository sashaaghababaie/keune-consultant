"use client";

import { useState, useEffect, Children, ReactNode } from "react";

export interface SliderState {
  current: number;
  next: number;
  prev: number;
  length: number;
}

export interface SliderProps {
  children: ReactNode | ReactNode[];

  /**
   * The amount of time (in miliseconds) a slide waits before
   * transitioning to the next slide.
   * (Default: 2000 (ms))
   */
  timer?: number;

  /**
   * The amount of time the transition animation takes.
   * (Default: 200 (ms))
   */
  transitionTime?: number;

  /**
   * Part of the slide(s) that should be displayed on the screen.
   * For example, if slidePerScreen = {1}, one slide will be seen in each transition.
   * slidePerScreen = {1.2}, 10% of the next slide and 10% of the previous slide will also be displayed on the screen.
   * (If next/previous slide is not available, 10 + 10 = 20% of the available slide will be visible on the screen.)
   * (Default: 1)
   */
  slidePerScreen?: number;

  /**
   * Index of the slide to show, starting index on first render or can be used with custom carousel.
   * (Default: 0)
   */
  slideToShow?: number;

  /**
   * Loop
   */
  isLoop?: boolean;

  /**
   * To determine the slider direction
   * (Default: ltr (Left to right))
   */
  dir?: "ltr" | "rtl";

  /**
   * A callback to access an object representing the current, next, previous and length of the slider by indices.
   * @param slider
   * An object representing the current index, next index, previous inddex and number of the slides.
   * @example
   * // Access all
   * onChange = {(slider) => console.log(slider)}
   * @example
   * // Get the current slide index
   * onChange = {(slider) => console.log(slider.current)}
   * @example
   * // Get the next slide index
   * onChange = {(slider) => console.log(slider.next)}
   */
  onChange?: (slider: SliderState) => any;

  /**
   * Run before each transition
   */
  beforeTransition?: () => any;

  /**
   * Pause the transition on hover
   */
  pauseOnHover?: boolean;
}

/**
 *
 * @param timer
 * The amount of time (in miliseconds) a slide waits before transition to the next slide.
 * (Default: 2000 (ms))
 *
 * @param transitionTime
 * The amount of time the transition animation takes.
 * (Default: 200 (ms))
 *
 * @param slidePerScreen
 * Part of the slide(s) that should be displayed on the screen.
 * For example, if slidePerScreen = {1}, one slide will be seen in each transition.
 * slidePerScreen = {1.2}, 10% of the next slide and 10% of the previous slide will also be displayed on the screen.
 * (If next/previous slide is not available, 10 + 10 = 20% of the available slide will be visible on the screen.)
 * (Default: 1)
 *
 * @param slideToShow
 * Index of the slide to show, starting index on first render or can be used with custom carousel.
 * (Default: 0)
 *
 * @param isLoop
 * Loop
 * (Default: true)
 *
 * @param dir
 * To determine the slider direction
 * (Default: ltr (Left to right))
 *
 * @param onChange
 * A callback to access an object representing the current, next, previous and length of the slider by indices.
 *
 * @param beforeTransition
 * Run before each transition
 *
 * @param pauseOnHover?: boolean;
 * Pause the transition on hover
 */

export function Slider({
  slideToShow = 0,
  slidePerScreen = 1,
  timer = 2000,
  transitionTime = 200,
  dir = "ltr",
  isLoop = false,
  children,
  pauseOnHover = true,
  ...props
}: SliderProps) {
  const [margin, setMargin] = useState(slideToShow);
  const [mouseOver, setMouseOver] = useState(false);

  const slidePerScreenPercent = 100 / slidePerScreen;
  const childrnArray = Children.toArray(children);

  const [margins, setMargins] = useState<number[]>([]);
  // console.log(children.length);
  useEffect(() => {
    const _margins = childrnArray.map((_, i) => {
      if (i === 0) return 0;
      if (i === childrnArray.length - 1)
        return i * slidePerScreenPercent * -1 + (100 - slidePerScreenPercent);
      return i * slidePerScreenPercent * -1 + (100 - slidePerScreenPercent) / 2;
    });

    setMargins(_margins);
    // setMargin(0);
  }, [childrnArray.length, children]);

  useEffect(() => {
    if (props.onChange && typeof props.onChange === "function") {
      let next, prev;

      if (isLoop) {
        next = margin === margins.length - 1 ? 0 : margin + 1;
        prev = margin === 0 ? margins.length - 1 : margin - 1;
      } else {
        next = margin === margins.length - 1 ? margin : margin + 1;
        prev = margin === 0 ? 0 : margin - 1;
      }

      const swiper: SliderState = {
        current: margin,
        next,
        prev,
        length: margins.length,
      };

      props.onChange(swiper);
    }
  }, [margin]);

  useEffect(() => {
    if (props.beforeTransition && typeof props.beforeTransition === "function")
      props.beforeTransition();

    setMargin(slideToShow);
  }, [slideToShow]);

  //   const prevSlide = () => {
  //     if (
  //       props.beforeTransition &&
  //       typeof props.beforeTransition === "function"
  //     ) {
  //       props.beforeTransition();
  //     }

  //     if (margin === 0) setMargin(margins.length - 1);
  //     else setMargin(margin - 1);
  //   };

  const nextSlide = () => {
    if (
      props.beforeTransition &&
      typeof props.beforeTransition === "function"
    ) {
      props.beforeTransition();
    }

    if (margin === margins.length - 1) {
      if (!isLoop) return;
      setMargin(0);
    } else {
      setMargin(margin + 1);
    }
  };

  useEffect(() => {
    if (timer === 0) return;
    const _timer = setTimeout(() => nextSlide(), timer);

    if (pauseOnHover && mouseOver) clearTimeout(_timer);

    return () => clearTimeout(_timer);
  }, [margin, mouseOver]);

  return (
    <div
      dir={dir}
      style={{
        width: "100%",
        height: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transition: `${
            dir === "ltr" ? "margin-left" : "margin-right"
          } ${transitionTime}ms`,
          [dir === "ltr" ? "marginLeft" : "marginRight"]: `${margins[margin]}%`,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {childrnArray!.map((child, i) => (
            <div
              key={`slide-${i}`}
              style={{ width: `${slidePerScreenPercent}%`, flexShrink: "0" }}
              onMouseEnter={() => pauseOnHover && setMouseOver(true)}
              onMouseLeave={() => pauseOnHover && setMouseOver(false)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

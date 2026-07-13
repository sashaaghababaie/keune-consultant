"use client";

import { useState, ReactNode } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "./modal";
import { Slider, SliderState } from "./slider";

// ─── Slides ───────────────────────────────────────────────────────────────────
// Add, remove, or reorder slides freely — each entry is raw JSX, rendered as-is.

const slides: ReactNode[] = [
  <>
    <div className="flex relative  justify-center items-center gap-3 flex-col w-full">
      <h2 className="text-lg  font-bold pb-12">
        BHC | B2C online Haircare Consultation
      </h2>
      <img
        src="blob-2.jpg"
        className="object-contain absolute top-1/2 -translate-y-1/3 h-68 opacity-20"
      />
      <div className="flex flex-1 pb-24 justify-center">
        <div className="flex items-center">
          <img src="logo.png" alt="logo" className="h-20" />
          <p className="text-4xl mt-11">BHC</p>
        </div>
      </div>
    </div>

    <div className="space-y-12">
      <p>
        BHC is a personalized digital hair wellness platform designed to
        transform the way consumers discover, understand, and care for their
        hair.
      </p>
    </div>
  </>,

  <>
    <h2 className="text-lg font-bold pb-4">Understand Your Hair</h2>
    <div className="space-y-12">
      <p>
        We'll assess your hair and scalp characteristics to identify your unique
        profile and current concerns. We provide results in 5 sections. Each
        section will provide you with a personalized care routine and product
        recommendations.
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <img
            src="icons/bb.jpg"
            alt="Before Bath"
            className="w-8 h-8 object-cover"
          />

          <span className="hidden sm:inline text-xs font-bold tracking-wide truncate">
            Before Bath
          </span>
        </div>
        <div className="flex items-end gap-2">
          <img
            src="icons/bb.jpg"
            alt="Before Bath"
            className="w-8 h-8  object-cover"
          />

          <span className="hidden sm:inline text-xs font-bold tracking-wide truncate">
            In Bath
          </span>
        </div>
        <div className="flex items-end gap-2">
          <img
            src="icons/ab.jpg"
            alt="After Bath"
            className="w-8 h-8  object-cover"
          />

          <span className="hidden sm:inline text-xs font-bold tracking-wide truncate">
            After Bath
          </span>
        </div>
        <div className="flex items-end gap-2">
          <img
            src="icons/style.jpg"
            alt="Style"
            className="w-8 h-8 object-cover"
          />

          <span className="hidden sm:inline text-xs font-bold tracking-wide truncate">
            Styling
          </span>
        </div>
        <div className="flex items-end gap-2">
          <img
            src="icons/derma.jpg"
            alt="Extra Derma Care"
            className="w-8 h-8  object-cover"
          />

          <span className="hidden sm:inline text-xs font-bold tracking-wide truncate">
            Extra Derma Care
          </span>
        </div>
      </div>
    </div>
  </>,

  <>
    <h2 className="text-lg font-bold pb-4">Get Your Recommendations</h2>
    <div className="space-y-12">
      <p>
        Based on your answers, we'll guide you toward the most effective care
        routine and product recommendations for healthier-looking hair.
      </p>
      <div className="flex flex-col gap-2 bg-slate-200 p-4">
        <p className="text-xs">
          The survey will only take a few minutes to complete.
        </p>
        <p className="text-xs">Click to start your hair wellness journey.</p>
      </div>
    </div>
  </>,
];

export function StartModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [slider, setSlider] = useState<SliderState>({
    current: 0,
    next: 0,
    prev: 0,
    length: slides.length,
  });
  const isLastSlide = current === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onClose();
      return;
    }
    setCurrent(slider.next);
  };

  const handlePrev = () => {
    setCurrent(slider.prev);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalHeader>KEUNE CARE CONSULTATION</ModalHeader>

      {/* Stacks all slides in the same grid cell so the container height
          always matches the tallest slide; Slider then overlays the
          active one on top of that reserved space. */}
      <ModalContent>
        <div style={{ width: "100%" }}>
          {/* {slides.map((slide, i) => (
          <ModalContent
            key={i}
            className="col-start-1 row-start-1 invisible text-center px-12"
          >
            {slide}
          </ModalContent>
        ))} */}

          {/* <div className="col-start-1 row-start-1"> */}
          <Slider
            slideToShow={current}
            timer={0}
            isLoop={false}
            onChange={setSlider}
          >
            {slides.map((slide, i) => (
              <ModalContent key={i} className="text-center px-12">
                {slide}
              </ModalContent>
            ))}
          </Slider>
          {/* </div> */}
        </div>
      </ModalContent>
      <ModalFooter>
        <div className="flex justify-center items-center gap-3 flex-col w-full">
          <img src="keune-care-logo.webp" className="w-20" />
          <div className="flex w-full justify-center items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-1 w-1 rounded-full transition-colors ${
                  i === current ? "bg-black" : "bg-black/20"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between w-full items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className=" disabled:opacity-30  text-black hover:text-black/70  h-8 min-w-24 px-2"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              className="bg-black hover:bg-black/80 text-white h-8 min-w-32 px-2"
            >
              {isLastSlide ? "Start" : "Next"}
            </button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

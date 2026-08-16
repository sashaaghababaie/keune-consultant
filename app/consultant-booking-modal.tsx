"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "./modal";
import { Slider, SliderState } from "./slider";

// ─── Time slot config ───────────────────────────────────────────────────────
// Edit these to change the bookable window / granularity.
const TIME_CONFIG = {
  start: 10, // hour, 24h format
  end: 17, // hour, 24h format
  step: 30, // minutes
};

const DAYS_AHEAD = 7;

interface Product {
  id: number;
  name: string;
  price: number;
}

interface DayOption {
  key: string; // yyyy-mm-dd
  label: string; // short label e.g. "Mon, Jul 30"
}

interface TimeOption {
  key: string; // HH:mm
  label: string; // e.g. "10:00 AM"
}

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = minute.toString().padStart(2, "0");
  return `${h12}:${mm} ${period}`;
}

function buildDayOptions(): DayOption[] {
  const days: DayOption[] = [];
  const today = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    days.push({ key, label });
  }
  return days;
}

function buildTimeOptions(): TimeOption[] {
  const times: TimeOption[] = [];
  const { start, end, step } = TIME_CONFIG;
  for (let mins = start * 60; mins < end * 60; mins += step) {
    const hour = Math.floor(mins / 60);
    const minute = mins % 60;
    const key = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    times.push({ key, label: formatTime(hour, minute) });
  }
  return times;
}

// Deterministic mock of "reserved" slots so the UI has something to
// demonstrate disabled states without needing a real backend.
function isReservedDate(key: string) {
  const day = parseInt(key.slice(-2), 10);
  return day % 3 === 0;
}

function isReservedTime(dayKey: string, timeKey: string) {
  let hash = 0;
  const str = dayKey + timeKey;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100;
  }
  return hash < 25;
}

type Step = "photo" | "schedule";

function PhotoInstructions({ onUnderstand }: { onUnderstand: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs text-zinc-500 text-center max-w-xs">
        We'll ask you to take a photo of your hair. Please show the back of your
        hair, like the example below.
      </p>
      <div className="w-full max-w-xs aspect-square bg-zinc-100 border border-black/10 overflow-hidden">
        <img
          src="hair-behind.jpg"
          alt="Example: correct way to photograph your hair"
          className="w-full h-full object-cover"
        />
      </div>
      <button
        onClick={onUnderstand}
        className="bg-black text-white text-sm px-6 py-2.5 hover:bg-black/80 transition-colors"
      >
        Understand
      </button>
    </div>
  );
}

function CameraCapture({
  image,
  onCapture,
  onRetake,
}: {
  image: string | null;
  onCapture: (dataUrl: string) => void;
  onRetake: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (image) return;

    let cancelled = false;
    setCameraError(false);

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        if (!cancelled) setCameraError(true);
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [image]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/jpeg", 0.9));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onCapture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (image) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-xs aspect-square bg-zinc-100 border border-black/10 overflow-hidden">
          <img
            src={image}
            alt="Captured hair"
            className="w-full -scale-x-100 h-full object-cover"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRetake}
            className="border border-black/20 text-black text-sm px-6 py-2.5 hover:bg-black/5 transition-colors"
          >
            Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-xs aspect-square bg-zinc-900 border border-black/10 overflow-hidden flex items-center justify-center">
        {cameraError ? (
          <p className="text-xs text-zinc-400 text-center px-6">
            Camera unavailable. Upload a photo instead.
          </p>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />

      {cameraError ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-black text-white text-sm px-6 py-2.5 hover:bg-black/80 transition-colors"
          >
            Upload photo
          </button>
        </>
      ) : (
        <button
          onClick={handleCapture}
          className="bg-black text-white text-sm px-6 py-2.5 hover:bg-black/80 transition-colors"
        >
          Capture
        </button>
      )}
    </div>
  );
}

function DateTimeSelector({
  days,
  times,
  selectedDay,
  selectedTime,
  onSelectDay,
  onSelectTime,
}: {
  days: DayOption[];
  times: TimeOption[];
  selectedDay: string | null;
  selectedTime: string | null;
  onSelectDay: (key: string) => void;
  onSelectTime: (key: string) => void;
}) {
  const timesForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return times.map((t) => ({
      ...t,
      reserved: isReservedTime(selectedDay, t.key),
    }));
  }, [selectedDay, times]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-bold pb-3">Choose a date</p>

        {/* Native select on small screens */}
        <select
          className="w-full sm:hidden border border-black/20 px-3 py-2.5 text-sm bg-white"
          value={selectedDay ?? ""}
          onChange={(e) => onSelectDay(e.target.value)}
        >
          <option value="" disabled>
            Select a date
          </option>
          {days.map((d) => (
            <option key={d.key} value={d.key} disabled={isReservedDate(d.key)}>
              {d.label}
              {isReservedDate(d.key) ? " (unavailable)" : ""}
            </option>
          ))}
        </select>

        {/* Buttons on larger screens */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {days.map((d) => {
            const reserved = isReservedDate(d.key);
            const active = selectedDay === d.key;
            return (
              <button
                key={d.key}
                disabled={reserved}
                onClick={() => onSelectDay(d.key)}
                className={`text-xs font-medium px-3 py-2 border transition-colors ${
                  active
                    ? "bg-black text-white border-black"
                    : reserved
                      ? "border-black/10 text-zinc-300 line-through cursor-not-allowed"
                      : "border-black/20 text-black hover:bg-black/5"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold pb-3">Choose a time</p>

        {!selectedDay ? (
          <p className="text-xs text-zinc-400">Select a date first.</p>
        ) : (
          <>
            {/* Native select on small screens */}
            <select
              className="w-full sm:hidden border border-black/20 px-3 py-2.5 text-sm bg-white"
              value={selectedTime ?? ""}
              onChange={(e) => onSelectTime(e.target.value)}
            >
              <option value="" disabled>
                Select a time
              </option>
              {timesForSelectedDay.map((t) => (
                <option key={t.key} value={t.key} disabled={t.reserved}>
                  {t.label}
                  {t.reserved ? " (booked)" : ""}
                </option>
              ))}
            </select>

            {/* Buttons on larger screens */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {timesForSelectedDay.map((t) => {
                const active = selectedTime === t.key;
                return (
                  <button
                    key={t.key}
                    disabled={t.reserved}
                    onClick={() => onSelectTime(t.key)}
                    className={`text-xs font-medium px-3 py-2 border transition-colors ${
                      active
                        ? "bg-black text-white border-black"
                        : t.reserved
                          ? "border-black/10 text-zinc-300 line-through cursor-not-allowed"
                          : "border-black/20 text-black hover:bg-black/5"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Mock booking submission — swap for a real fetch call later.
function mockBookConsultation(payload: {
  image: string;
  day: string;
  time: string;
  products: Product[];
}): Promise<{ confirmationId: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ confirmationId: `BHC-${Date.now().toString().slice(-6)}` });
    }, 1000);
  });
}

export function ConsultantBookingModal({
  isOpen,
  onClose,
  selectedProducts,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
}) {
  const [step, setStep] = useState(0);
  const [slider, setSlider] = useState<SliderState>({
    current: 0,
    next: 0,
    prev: 0,
    length: 2,
  });
  const [image, setImage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const days = useMemo(() => buildDayOptions(), []);
  const times = useMemo(() => buildTimeOptions(), []);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setImage(null);
      setShowInstructions(true);
      setSelectedDay(null);
      setSelectedTime(null);
      setBooking(false);
      setConfirmation(null);
    }
  }, [isOpen]);

  const isPhotoStep = step === 0;
  const canGoNext = isPhotoStep ? !!image : !!selectedDay && !!selectedTime;

  const handleNext = () => {
    if (!canGoNext) return;
    setStep(slider.next);
  };

  const handlePrev = () => {
    setStep(slider.prev);
  };

  const handleBook = async () => {
    if (!image || !selectedDay || !selectedTime) return;
    setBooking(true);
    const result = await mockBookConsultation({
      image,
      day: selectedDay,
      time: selectedTime,
      products: selectedProducts,
    });
    setBooking(false);
    setConfirmation(result.confirmationId);
  };

  const selectedDayLabel = days.find((d) => d.key === selectedDay)?.label;
  const selectedTimeLabel = times.find((t) => t.key === selectedTime)?.label;

  if (confirmation) {
    return (
      <Modal size="md" isOpen={isOpen} onClose={onClose}>
        <ModalHeader onClose={onClose}>Booking confirmed</ModalHeader>
        <ModalContent>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-zinc-600">
              You're booked in for{" "}
              <span className="font-bold text-black">{selectedDayLabel}</span>{" "}
              at{" "}
              <span className="font-bold text-black">{selectedTimeLabel}</span>.
            </p>
            <p className="text-xs text-zinc-400">
              Confirmation #{confirmation}
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <button
            onClick={onClose}
            className="bg-black text-white text-sm px-6 py-2 hover:bg-black/80 transition-colors"
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>Book a consultant</ModalHeader>
      <ModalContent scrollable>
        <Slider
          slideToShow={step}
          timer={0}
          isLoop={false}
          onChange={setSlider}
        >
          <div>
            <p className="text-sm font-bold pb-4 text-center">
              Take a photo of your hair
            </p>
            {showInstructions ? (
              <PhotoInstructions
                onUnderstand={() => setShowInstructions(false)}
              />
            ) : (
              <CameraCapture
                image={image}
                onCapture={setImage}
                onRetake={() => setImage(null)}
              />
            )}
          </div>
          <div>
            <DateTimeSelector
              days={days}
              times={times}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              onSelectDay={(key) => {
                setSelectedDay(key);
                setSelectedTime(null);
              }}
              onSelectTime={setSelectedTime}
            />
          </div>
        </Slider>
      </ModalContent>
      <ModalFooter>
        <div className="flex w-full justify-between items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="disabled:opacity-30 text-black hover:text-black/70 h-8 min-w-24 px-2"
          >
            Prev
          </button>
          {step === 0 ? (
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="bg-black hover:bg-black/80 disabled:opacity-30 disabled:hover:bg-black text-white h-8 min-w-32 px-2"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleBook}
              disabled={!canGoNext || booking}
              className="bg-black hover:bg-black/80 disabled:opacity-30 disabled:hover:bg-black text-white h-8 min-w-32 px-2 flex items-center justify-center gap-2"
            >
              {booking ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Book"
              )}
            </button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "./modal";
import { ConsultantBookingModal } from "./consultant-booking-modal";

// ─── Reference data ────────────────────────────────────────────────────────
// Shaped the way an API response would look: a list of groups, each with an
// icon and a set of products. Swap this for a fetch call later without
// touching the rendering logic below.

interface Product {
  id: number;
  name: string;
  link: string;
  price: number;
  image: string;
  description: string;
}

interface ResultGroup {
  id: string;
  title: string;
  icon: string;
  products: Product[];
}

// ─── Color palette ─────────────────────────────────────────────────────────
// One accent color per section, used for the sidebar highlight, section
// header icon, and the section's left border.

interface SectionColor {
  border: string;
  bg: string;
  bgSoft: string;
  text: string;
  ring: string;
}

const sectionColors: Record<string, SectionColor> = {
  "before-bath": {
    border: "border-l-sky-400",
    bg: "bg-sky-400",
    bgSoft: "bg-sky-400/10",
    text: "text-sky-500",
    ring: "ring-sky-400",
  },
  "in-bath": {
    border: "border-l-violet-400",
    bg: "bg-violet-400",
    bgSoft: "bg-violet-400/10",
    text: "text-violet-500",
    ring: "ring-violet-400",
  },
  "after-bath": {
    border: "border-l-amber-400",
    bg: "bg-amber-400",
    bgSoft: "bg-amber-400/10",
    text: "text-amber-500",
    ring: "ring-amber-400",
  },
  style: {
    border: "border-l-emerald-400",
    bg: "bg-emerald-400",
    bgSoft: "bg-emerald-400/10",
    text: "text-emerald-500",
    ring: "ring-emerald-400",
  },
  derma: {
    border: "border-l-rose-400",
    bg: "bg-rose-400",
    bgSoft: "bg-rose-400/10",
    text: "text-rose-500",
    ring: "ring-rose-400",
  },
};

const resultGroups: ResultGroup[] = [
  {
    id: "before-bath",
    title: "Before Bath",
    icon: "icons/bb.jpg",
    products: [
      {
        id: 9,
        name: "KEUNE Derma Peeling - 35ml",
        price: 32.99,
        image: "359.webp",
        link: "https://keunecare.com/derma-peeling/",
        description: "Scalp treatment and refresher",
      },
      {
        id: 7,
        name: "KEUNE Clean Slate - 200ml",
        price: 29.99,
        image: "250.webp",
        link: "https://keunecare.com/style-clean-slate/",
        description: "Dry cleaner and eliminate oil",
      },
    ],
  },
  {
    id: "in-bath",
    title: "In Bath",
    icon: "icons/ib.jpg",
    products: [
      {
        id: 1,
        name: "Keune Long & Strong Shampoo - 300ml",
        link: "https://keunecare.com/care-long-strong-shampoo-300ml/",
        price: 24.99,
        image: "long-strong.png",
        description: "Deep nourishment for scalp and hair",
      },
      {
        id: 2,
        name: "KEUNE Velvet Smooth Conditioner - 250ml",
        price: 32.99,
        image: "velvet.webp",
        link: "https://keunecare.com/care-velvet-smooth-conditioner-250ml/",
        description: "Moisturize hairs and eliminates frizz",
      },
      {
        id: 3,
        name: "KEUNE Color Brillianz Mask - 250ml",
        link: "https://keunecare.com/care-color-brillianz-mask-250ml/",
        price: 27.99,
        image: "brillianz.jpg",
        description: "Protect and strengthens colored hair",
      },
    ],
  },
  {
    id: "after-bath",
    title: "After Bath",
    icon: "icons/ab.jpg",
    products: [
      {
        id: 4,
        name: "Keune Velvet Smooth 2 Phase spray - 200ml",
        link: "https://keunecare.com/keune-care-velvet-smooth-2-phase-spray-200ml-2/",
        price: 24.99,
        image: "velvet-2phase.jpg",
        description: "Conditioner enriched with vegan creatine",
      },
      {
        id: 5,
        name: "KEUNE Long & Strong Leave-in - 100ml ",
        price: 32.99,
        image: "long-strong-leave-in-100ml.jpg",
        link: "https://keunecare.com/care-long-strong-leave-in-100ml/",
        description: "Densifying daily treatment",
      },
      {
        id: 6,
        name: "KEUNE Radiant Gloss Illume Infusion - 100ml",
        link: "https://keunecare.com/care-radiant-gloss-illume-infusion-100ml/",
        price: 24.99,
        image: "radiant-gloass-illume.webp",
        description: "Add shine and eliminate frizz",
      },
    ],
  },
  {
    id: "style",
    title: "Style",
    icon: "icons/style.jpg",
    products: [
      {
        id: 7,
        name: "KEUNE Clean Slate - 200ml",
        price: 29.99,
        image: "250.webp",
        link: "https://keunecare.com/style-clean-slate/",
        description: "Dry cleaner and eliminate oil",
      },
      {
        id: 8,
        name: "KEUNE Resetter - 200ml",
        link: "https://keunecare.com/style-resetter/",
        price: 19.99,
        image: "313.webp",
        description:
          "Protect microbioms, strengthen fibers and eliminate frizz",
      },
    ],
  },
  {
    id: "derma",
    title: "Derma",
    icon: "icons/derma.jpg",
    products: [
      {
        id: 9,
        name: "KEUNE Derma Peeling - 35ml",
        price: 32.99,
        image: "359.webp",
        link: "https://keunecare.com/derma-peeling/",
        description: "Scalp treatment and refresher",
      },
      {
        id: 10,
        name: "KEUNE Derma Regulate Shampoo – 300ml",
        link: "https://keunecare.com/care-derma-regulate-shampoo2/",
        price: 27.99,
        image: "derma-regulate-3.webp",
        description: "Balancing the natural oil (Sebum) for oily scalps",
      },
    ],
  },
];

function formatPrice(n: number) {
  return "$" + n.toFixed(2);
}

function ProductRow({
  product,
  checked,
  onToggle,
}: {
  product: Product;
  checked: boolean;
  onToggle: (id: number) => void;
}) {
  return (
    <label className="hover:bg-black/10 px-2 flex items-start gap-3 sm:gap-4 py-4 border-b border-black/10 last:border-b-0 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(product.id)}
        className="mt-1.5 h-4 w-4 shrink-0 accent-black cursor-pointer"
      />
      <div className="w-14 h-14 sm:w-20 sm:h-20 bg-zinc-100 border border-black/10 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-sm leading-snug">{product.name}</p>
          <span className="font-bold text-sm whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-xs text-zinc-500">{product.description}</p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={product.link}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-zinc-500 underline w-fit"
        >
          How to use
        </a>
      </div>
    </label>
  );
}

function GroupSection({
  group,
  sectionRef,
  selectedIds,
  onToggle,
}: {
  group: ResultGroup;
  sectionRef: (el: HTMLDivElement | null) => void;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  const color = sectionColors[group.id];

  return (
    <div
      ref={sectionRef}
      data-section-id={group.id}
      className={`pb-8 mb-8 pl-4 border-b border-l-4 border-zinc-500 ${color.border} scroll-mt-4 last:border-b-0 last:mb-0 last:pb-0`}
    >
      <h2 className="flex items-center gap-2 text-lg font-bold pb-2">
        <span
          className={`w-7 h-7 shrink-0 rounded-full overflow-hidden ring-2 ring-offset-2 ${color.ring}`}
        >
          <img src={group.icon} alt="" className="w-full h-full object-cover" />
        </span>
        {group.title}
      </h2>
      <div className="flex flex-col">
        {group.products.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            checked={selectedIds.has(p.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="shrink-0 w-14 sm:w-48 border-r border-black/10 bg-white flex flex-col py-4 overflow-y-auto">
      {resultGroups.map((group) => {
        const isActive = group.id === activeId;
        const color = sectionColors[group.id];
        return (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className={`flex items-center gap-3 px-3 sm:px-4 py-3 border-l-4 transition-colors text-left ${
              isActive
                ? `${color.border} ${color.bgSoft} text-black`
                : "border-l-transparent text-zinc-600 hover:bg-black/5"
            }`}
          >
            <span
              className={`w-7 h-7 shrink-0 rounded-full overflow-hidden bg-zinc-100 ring-2 ${
                isActive ? color.ring : "ring-transparent"
              }`}
            >
              <img
                src={group.icon}
                alt={group.title}
                className="w-full h-full object-cover"
              />
            </span>
            <span className="hidden sm:inline text-xs font-bold tracking-wide truncate">
              {group.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

const allProducts: Product[] = resultGroups.flatMap((g) => g.products);

export function ResultsModal3({
  isOpen,
  onRetry,
}: {
  isOpen: boolean;
  onRetry: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [consultantOpen, setConsultantOpen] = useState(false);
  const [activeId, setActiveId] = useState(resultGroups[0].id);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isProgrammaticScroll = useRef(false);
  const scrollEndTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedProducts = allProducts.filter((p) => selectedIds.has(p.id));
  const selectedCount = selectedProducts.length;
  const selectedTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddSelectedToCart = () => {
    if (selectedCount === 0) return;
    setToast(
      `${selectedCount} item${selectedCount > 1 ? "s" : ""} added to cart!`,
    );
    setTimeout(() => setToast(null), 2500);
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    const el = sectionRefs.current[id];
    const container = scrollContainerRef.current;
    if (!el || !container) return;

    isProgrammaticScroll.current = true;
    const top = el.offsetTop - container.offsetTop;
    container.scrollTo({ top, behavior: "smooth" });
  };

  // Track which section is currently in view to keep the sidebar in sync
  // while the user scrolls manually. While a sidebar click is driving a
  // smooth scroll, ignore intermediate positions (which would otherwise
  // flash unrelated sections as active) and only resume once scrolling has
  // actually settled — detected via a debounce rather than a fixed delay,
  // since smooth-scroll duration varies with travel distance.
  useEffect(() => {
    if (loading) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) {
        window.clearTimeout(scrollEndTimer.current);
        scrollEndTimer.current = window.setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 120);
        return;
      }
      const containerTop = container.scrollTop;

      // Once scrolled (near) the bottom, the last section can never reach
      // the "closest to top" threshold below if it's shorter than the
      // viewport, so it would never win the distance comparison. Detect
      // end-of-scroll explicitly and force the last section active.
      const atBottom =
        containerTop + container.clientHeight >= container.scrollHeight - 2;
      if (atBottom) {
        setActiveId(resultGroups[resultGroups.length - 1].id);
        return;
      }

      let closestId = resultGroups[0].id;
      let closestDistance = Infinity;
      for (const group of resultGroups) {
        const el = sectionRefs.current[group.id];
        if (!el) continue;
        const distance = Math.abs(
          el.offsetTop - container.offsetTop - containerTop,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = group.id;
        }
      }
      setActiveId(closestId);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.clearTimeout(scrollEndTimer.current);
    };
  }, [loading]);

  return (
    <>
      <Modal
        size="full"
        isOpen={isOpen}
        onClose={() => {}}
        closeOnBackdrop={false}
        closeOnEsc={false}
      >
        <ModalHeader>Your Personalized Recommendations</ModalHeader>
        <div className="flex-1 min-h-0 flex flex-col relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-sm text-zinc-500 tracking-wide">
                Analyzing...
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex">
              <Sidebar activeId={activeId} onSelect={handleSelect} />
              <div
                ref={scrollContainerRef}
                className="flex-1 min-h-0 overflow-y-auto"
              >
                <ModalContent className="py-5 px-2 pb-24">
                  {resultGroups.map((group) => (
                    <GroupSection
                      key={group.id}
                      group={group}
                      sectionRef={(el) => {
                        sectionRefs.current[group.id] = el;
                      }}
                      selectedIds={selectedIds}
                      onToggle={handleToggle}
                    />
                  ))}
                </ModalContent>
              </div>
            </div>
          )}

          {!loading && (
            <div className="absolute z-10 flex w-full px-4  py-2 justify-between bg-white bottom-0 border-t border-b border-zinc-300">
              <div className="z-10">
                <button
                  onClick={() => setConsultantOpen(true)}
                  className="bg-[#f9aa9e] text-white border-none border font-bold border-black/30 text-sm px-6 py-2.5 shadow-md hover:opacity-80 transition-opacity"
                >
                  Need Consultant?
                </button>
              </div>

              <div className="z-10">
                <button
                  onClick={handleAddSelectedToCart}
                  disabled={selectedCount === 0}
                  className="bg-black flex flex-col text-white text-sm px-6 py-2.5 shadow-md hover:bg-black/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black flex items-center gap-2"
                >
                  <span>Add to cart</span>
                  {selectedCount > 0 && (
                    <span className="font-bold">
                      {selectedCount > 0 ? ` (${selectedCount})` : ""}{" "}
                      {formatPrice(selectedTotal)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        <ModalFooter className="justify-start">
          <button
            onClick={onRetry}
            className="text-sm text-zinc-400 hover:text-black underline underline-offset-2 transition-colors"
          >
            Retake the quiz
          </button>
        </ModalFooter>
      </Modal>

      <ConsultantBookingModal
        isOpen={consultantOpen}
        onClose={() => setConsultantOpen(false)}
        selectedProducts={selectedProducts}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-99999 bg-black text-white text-sm px-5 py-2.5 shadow-lg animate-[fade-in_0.2s_ease-out_forwards]">
          {toast}
        </div>
      )}
    </>
  );
}

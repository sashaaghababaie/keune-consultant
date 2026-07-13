"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "./modal";

// ─── Reference data ────────────────────────────────────────────────────────
// Shaped the way an API response would look: a list of groups, each with an
// icon, a set of products, and a bundle discount. Swap this for a fetch call
// later without touching the rendering logic below.

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
  bundleDiscountPct: number;
  products: Product[];
}

const resultGroups: ResultGroup[] = [
  {
    id: "before-bath",
    title: "Before Bath",
    icon: "icons/bb.jpg",
    bundleDiscountPct: 5,
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
    bundleDiscountPct: 5,
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
    bundleDiscountPct: 5,
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
    bundleDiscountPct: 5,
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
    bundleDiscountPct: 5,
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

function BundleSection({
  title,
  products,
  discountPct,
  onAddToCart,
}: {
  title: string;
  products: Product[];
  discountPct: number;
  onAddToCart: (bundleName: string) => void;
}) {
  const total = products.reduce((sum, p) => sum + p.price, 0);
  const discounted = total * (1 - discountPct / 100);

  return (
    <div className="border border-black/10 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-sm tracking-wide">{title}</h3>
        <span className="text-xs bg-black text-white px-2 py-0.5">
          {discountPct}% OFF
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {products.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-1 w-16">
            <div className="w-16 h-16 bg-zinc-100 border border-black/10 overflow-hidden shrink-0">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] text-center leading-tight line-clamp-2">
              {p.name}
            </p>
            <p className="text-[10px] font-bold">{formatPrice(p.price)}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-black/10">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-zinc-400 line-through">
            {formatPrice(total)}
          </span>
          <span className="font-bold text-sm">{formatPrice(discounted)}</span>
        </div>
        <button
          onClick={() => onAddToCart(title)}
          className="bg-black text-white text-xs px-4 py-1.5 hover:bg-black/80 transition-colors"
        >
          Add bundle to cart
        </button>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (name: string) => void;
}) {
  return (
    <div className="border border-black/10 flex flex-col">
      <div className="bg-zinc-100 flex items-center justify-center w-full aspect-square border-b border-black/10">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="font-bold text-sm leading-snug">{product.name}</p>
        <p className="text-xs text-zinc-500 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product.name)}
            className="bg-black text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
          >
            Add to cart
          </button>
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={product.link}
          className="text-xs text-zinc-500 underline"
        >
          How to use
        </a>
      </div>
    </div>
  );
}

function GroupSection({
  group,
  sectionRef,
  onAddToCart,
}: {
  group: ResultGroup;
  sectionRef: (el: HTMLDivElement | null) => void;
  onAddToCart: (name: string) => void;
}) {
  return (
    <div
      ref={sectionRef}
      data-section-id={group.id}
      className="pb-10 border-b border-zinc-500 scroll-mt-4"
    >
      <h2 className="text-lg font-bold pb-4">{group.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {group.products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
      <BundleSection
        title={`${group.title} bundle`}
        products={group.products}
        discountPct={group.bundleDiscountPct}
        onAddToCart={onAddToCart}
      />
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
        return (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className={`flex items-center gap-3 px-3 sm:px-4 py-3 transition-colors text-left ${
              isActive
                ? "bg-black text-white"
                : "text-zinc-600 hover:bg-black/5"
            }`}
          >
            <span className="w-7 h-7 shrink-0  overflow-hidden bg-zinc-100 border-black/10">
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

export function ResultsModal2({
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

  const handleAddToCart = (name: string) => {
    setToast(`"${name}" added to cart!`);
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
        <div className="flex-1 min-h-0 flex flex-col">
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
                <ModalContent className="!py-5">
                  {resultGroups.map((group) => (
                    <GroupSection
                      key={group.id}
                      group={group}
                      sectionRef={(el) => {
                        sectionRefs.current[group.id] = el;
                      }}
                      onAddToCart={handleAddToCart}
                    />
                  ))}

                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 border-t border-black/10" />
                    <span className="text-xs text-zinc-400 shrink-0">or</span>
                    <div className="flex-1 border-t border-black/10" />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setConsultantOpen(true)}
                      className="border border-black/30 text-sm px-6 py-2 hover:bg-black/5 transition-colors"
                    >
                      Confirm with a consultant
                    </button>
                  </div>
                </ModalContent>
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

      <Modal
        size="md"
        isOpen={consultantOpen}
        onClose={() => setConsultantOpen(false)}
      >
        <ModalHeader onClose={() => setConsultantOpen(false)}>
          We heard you
        </ModalHeader>
        <ModalContent>
          <p className="text-sm text-zinc-600 py-4 text-center">
            We heard you — we will reach out to you as soon as possible.
          </p>
        </ModalContent>
        <ModalFooter>
          <button
            onClick={() => setConsultantOpen(false)}
            className="bg-black text-white text-sm px-6 py-2 hover:bg-black/80 transition-colors"
          >
            Close
          </button>
        </ModalFooter>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-99999 bg-black text-white text-sm px-5 py-2.5 shadow-lg animate-[fade-in_0.2s_ease-out_forwards]">
          {toast}
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "./modal";
const mockProducts = [
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
    description: "Protect microbioms, strengthen fibers and eliminate frizz",
  },
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
];

const inBath = mockProducts.slice(0, 3);
const afterBath = mockProducts.slice(3, 6);
const styling = mockProducts.slice(6, 8);
const extra = mockProducts.slice(8, 10);

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
  products: typeof mockProducts;
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

export function ResultsModal({
  isOpen,
  onRetry,
}: {
  isOpen: boolean;
  onRetry: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [consultantOpen, setConsultantOpen] = useState(false);

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
        <ModalContent scrollable className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-sm text-zinc-500 tracking-wide">
                Analyzing...
              </p>
            </div>
          ) : (
            <>
              <div className="pb-10 border-b border-zinc-500">
                <h2 className="text-lg font-bold pb-4">
                  For your In-Bath CARE Routine
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {inBath.map((p) => (
                    <div
                      key={p.id}
                      className="border border-black/10 flex flex-col"
                    >
                      <div className="bg-zinc-100 flex items-center justify-center w-full aspect-square border-b border-black/10">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-2">
                        <p className="font-bold text-sm leading-snug">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500 flex-1">
                          {p.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm">
                            {formatPrice(p.price)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(p.name)}
                            className="bg-black text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
                          >
                            Add to cart
                          </button>
                        </div>

                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={p.link}
                          className="text-xs text-zinc-500 underline"
                        >
                          How to use
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <BundleSection
                  title="In-Bath bundle"
                  products={inBath}
                  discountPct={5}
                  onAddToCart={handleAddToCart}
                />
              </div>
              <div className="pb-10 border-b mt-10 border-zinc-500">
                <h2 className="text-lg font-bold pb-4">
                  For Your After-Bath Care Routine
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {afterBath.map((p) => (
                    <div
                      key={p.id}
                      className="border border-black/10 flex flex-col"
                    >
                      <div className="bg-zinc-100 flex items-center justify-center w-full aspect-square border-b border-black/10">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-2">
                        <p className="font-bold text-sm leading-snug">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500 flex-1">
                          {p.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm">
                            {formatPrice(p.price)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(p.name)}
                            className="bg-black text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
                          >
                            Add to cart
                          </button>
                        </div>

                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={p.link}
                          className="text-xs text-zinc-500 underline"
                        >
                          How to use
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <BundleSection
                  title="After-Bath bundle"
                  products={afterBath}
                  discountPct={5}
                  onAddToCart={handleAddToCart}
                />
              </div>
              <div className="pb-10 border-b mt-10 border-zinc-500">
                <h2 className="text-lg font-bold pb-4">
                  For Your Styling Routine
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {styling.map((p) => (
                    <div
                      key={p.id}
                      className="border border-black/10 flex flex-col"
                    >
                      <div className="bg-zinc-100 flex items-center justify-center w-full aspect-square border-b border-black/10">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-2">
                        <p className="font-bold text-sm leading-snug">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500 flex-1">
                          {p.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm">
                            {formatPrice(p.price)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(p.name)}
                            className="bg-black text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
                          >
                            Add to cart
                          </button>
                        </div>

                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={p.link}
                          className="text-xs text-zinc-500 underline"
                        >
                          How to use
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <BundleSection
                  title="Styling bundle"
                  products={styling}
                  discountPct={5}
                  onAddToCart={handleAddToCart}
                />
              </div>
              <div className="pb-10  mt-10 border-zinc-500">
                <h2 className="text-lg font-bold pb-4">
                  Extra CARE for your scalp conditions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {extra.map((p) => (
                    <div
                      key={p.id}
                      className="border border-black/10 flex flex-col"
                    >
                      <div className="bg-zinc-100 flex items-center justify-center w-full aspect-square border-b border-black/10">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-2">
                        <p className="font-bold text-sm leading-snug">
                          {p.name}
                        </p>
                        <p className="text-xs text-zinc-500 flex-1">
                          {p.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm">
                            {formatPrice(p.price)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(p.name)}
                            className="bg-black text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
                          >
                            Add to cart
                          </button>
                        </div>

                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={p.link}
                          className="text-xs text-zinc-500 underline"
                        >
                          How to use
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <BundleSection
                  title="Extra-Care bundle"
                  products={extra}
                  discountPct={5}
                  onAddToCart={handleAddToCart}
                />
              </div>

              {/* <div className="flex flex-col gap-4 mb-6">
                <BundleSection
                  title="Essential Bundle"
                  products={inBath}
                  discountPct={5}
                  onAddToCart={handleAddToCart}
                />
                <BundleSection
                  title="Complete Bundle"
                  products={completeBundle}
                  discountPct={10}
                  onAddToCart={handleAddToCart}
                />
              </div> */}

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
            </>
          )}
        </ModalContent>
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

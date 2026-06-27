"use client";

import { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "./modal";
const mockProducts = [
  {
    id: 1,
    name: "Keune Long & Strong Conditioner",
    price: 24.99,
    image: "1.jpg",
    description: "Deep nourishment for dry, brittle hair",
  },
  {
    id: 2,
    name: "Keune Care Radiant Gloss illuminator",
    price: 32.99,
    image: "2.webp",
    description: "Defines curls and eliminates frizz",
  },
  {
    id: 3,
    name: "Keune Care Color Brillianze",
    price: 27.99,
    image: "3.jpg",
    description: "Balances oily scalp and roots",
  },
  {
    id: 4,
    name: "Keune Care Vital Nutrition Shampoo",
    price: 21.99,
    image: "1.jpg",
    description: "Strengthens and revitalizes weakened hair",
  },
  {
    id: 5,
    name: "Keune Care Derma Activate Serum",
    price: 38.99,
    image: "2.webp",
    description: "Stimulates scalp and promotes hair growth",
  },
];

const essentialBundle = mockProducts.slice(0, 3);
const completeBundle = mockProducts;

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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {essentialBundle.map((p) => (
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
                      <p className="font-bold text-sm leading-snug">{p.name}</p>
                      <p className="text-xs text-zinc-500 flex-1">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm">{formatPrice(p.price)}</span>
                        <button
                          onClick={() => handleAddToCart(p.name)}
                          className="bg-black text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <BundleSection
                  title="Essential Bundle"
                  products={essentialBundle}
                  discountPct={5}
                  onAddToCart={handleAddToCart}
                />
                <BundleSection
                  title="Complete Bundle"
                  products={completeBundle}
                  discountPct={10}
                  onAddToCart={handleAddToCart}
                />
              </div>

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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] bg-black text-white text-sm px-5 py-2.5 shadow-lg animate-[fade-in_0.2s_ease-out_forwards]">
          {toast}
        </div>
      )}
    </>
  );
}

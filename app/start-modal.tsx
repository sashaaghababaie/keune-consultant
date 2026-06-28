"use client";

import { Modal, ModalHeader, ModalContent, ModalFooter } from "./modal";

export function StartModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalHeader>KEUNE CARE CONSULTATION</ModalHeader>

      <ModalContent className="text-center px-12">
        <h2 className="text-lg font-bold pb-4">
          {/* Welcome to the Keune CARE Hair & Beard Consultant */}
          BHC | B2C online Haircare Consultation
        </h2>

        <div className="flex pb-8 justify-center">
          <div className="flex items-center">
            <img src="logo.png" alt="logo" className="h-20" />
            <p className="text-4xl mt-11">BHC</p>
          </div>
        </div>
        <div className="space-y-12">
          <p>
            BHC is a personalized digital hair wellness platform designed to
            transform the way consumers discover, understand, and care for their
            hair.
            {/* Healthy hair starts with understanding its unique needs. This
            personalized consultation is designed to assess your hair and beard
            characteristics, identify current concerns, and guide you toward the
            most effective care routine and product recommendations. By
            understanding your individual profile, we can help you achieve
            healthier-looking hair, improved manageability, and lasting
            confidence in your daily care choices. */}
          </p>
          <div className="flex flex-col gap-2 bg-slate-200 p-4">
            {/* <div className="bg-black/10 rounded-full shrink-0 w-16 h-16" />
            <p className="text-xs">
              The questions in this consultation have been carefully curated by
              <b> ELNAZ ADIB</b>, based on professional expertise and more than
              five years of experience with Keune's professional care portfolio.
            </p> */}
            <p className="text-xs">
              The survey will only take a few minutes to complete.
            </p>
            <p className="text-xs">
              Click to start your hair wellness journey.
            </p>
          </div>
          {/* <p>
            Take a few moments to complete the consultation and discover the
            care solutions best suited to you.
          </p> */}
        </div>
      </ModalContent>
      <ModalFooter>
        <div className="flex justify-center items-center gap-3 flex-col">
          <img src="keune-care-logo.webp" className="w-20" />
          <button
            onClick={onClose}
            className="bg-black hover:bg-black/80 text-white h-8 min-w-32 px-2"
          >
            Start
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

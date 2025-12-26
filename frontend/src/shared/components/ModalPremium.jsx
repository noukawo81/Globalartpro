import React from "react";
import { motion as _motion, AnimatePresence } from "framer-motion";

export default function ModalPremium({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <_motion.div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <_motion.div
            className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-[480px] 
                       -translate-x-1/2 -translate-y-1/2
                       rounded-xl bg-white shadow-2xl p-6"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {title || "Premium"}
              </h2>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="text-gray-700">{children}</div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
              >
                Fermer
              </button>
            </div>
          </_motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
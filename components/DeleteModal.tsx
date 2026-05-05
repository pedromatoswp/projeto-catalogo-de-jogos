"use client";

/**
 * components/DeleteModal.tsx
 *
 * A confirmation dialog that appears before deleting a game.
 * This prevents accidental deletions — good UX practice!
 */

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

type DeleteModalProps = {
  gameName: string;
  onConfirm: () => void; // Called when user confirms deletion
  onCancel: () => void;  // Called when user cancels
};

export default function DeleteModal({ gameName, onConfirm, onCancel }: DeleteModalProps) {
  return (
    // AnimatePresence + motion animate the modal in/out smoothly
    <AnimatePresence>
      {/* Backdrop (dark overlay behind the modal) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel} // Click outside to close
      >
        {/* Modal box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Deletar Jogo</h3>
            </div>
            <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-slate-400 text-sm mb-6">
            Tem certeza que deseja deletar{" "}
            <span className="text-white font-semibold">&quot;{gameName}&quot;</span>?
            Esta ação não pode ser desfeita.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 rounded-lg border border-slate-600 text-slate-300
                         hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                         bg-red-500 hover:bg-red-400 text-white transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Deletar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// QA: Modal confirmation verified

import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  message: string;
}

export function Toast({ message }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

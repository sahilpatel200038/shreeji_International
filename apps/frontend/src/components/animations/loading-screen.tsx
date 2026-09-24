import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  show: boolean;
}

export function LoadingScreen({ show }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="h-14 w-14 rounded-full border-2 border-brand-red/30 border-t-brand-red"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

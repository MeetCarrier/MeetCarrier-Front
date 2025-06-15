import type { FC, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  hideCloseButton?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  hideCloseButton,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 모달 뒷배경 */}
          <motion.div
            className={`absolute inset-0 z-40 bg-black/80 `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 모달 박스 */}
          <motion.div
            className={`absolute z-50 inset-0 flex items-center justify-center `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="bg-white w-[90%] max-w-[320px] rounded-2xl shadow-md p-6 relative font-GanwonEduAll_Light"
              onClick={(e) => e.stopPropagation()}
            >
              {!hideCloseButton && (
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                  onClick={onClose}
                >
                  ✕
                </button>
              )}
              <div className="max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

import type { FC } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import secretaryProfile from "../../../../assets/img/icons/Chat/secretaryProfile.svg";

interface Message {
  sender: "user" | "bot";
  text: string;
  createdAt: Date;
}

interface SecretaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hideCloseButton?: boolean;
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
}

const SecretaryModal: FC<SecretaryModalProps> = ({
  isOpen,
  onClose,
  hideCloseButton,
  messages,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 모달 박스만 중앙에 띄움 */}
          <motion.div
            className="fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[90%]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="bg-white w-full h-[470px] max-w-[320px] rounded-2xl shadow-none p-6 relative font-GanwonEduAll_Light"
              style={{
                boxShadow: "0 8px 40px 0 rgba(0,0,0,0.38)", // 그림자만
              }}
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
              <div className="max-h-[80vh] overflow-y-auto">
                {/* 챗봇 헤더 */}
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={secretaryProfile}
                    alt="Secretary Profile"
                    className="w-15 h-15 flex-shrink-0 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-bold">만남 배달부 비서 봇</h3>
                    <p className="text-gray-500 text-sm">
                      몇 초 이내로 답변을 받을 수 있어요
                    </p>
                  </div>
                </div>

                {/* 채팅 메시지 컨테이너 */}
                <div className="h-[calc(470px-120px)] overflow-y-auto pr-2">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      } mb-4`}
                    >
                      <div
                        className={`${
                          message.sender === "user"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-800"
                        } p-3 rounded-lg max-w-[80%]`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SecretaryModal;

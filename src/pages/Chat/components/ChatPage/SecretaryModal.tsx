import type { FC } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SecretaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    hideCloseButton?: boolean;
    messages: { sender: "user" | "bot"; text: string }[];
    input: string;
    setInput: (input: string) => void;
    onSend: () => void;
}

const SecretaryModal: FC<SecretaryModalProps> = ({
    isOpen,
    onClose,
    hideCloseButton,
    messages,
    input,
    setInput,
    onSend,
}) => {
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
                                boxShadow: "0 8px 40px 0 rgba(0,0,0,0.38)",  // 그림자만
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
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h3 className="text-lg font-bold">만남 배달부 비서 봇</h3>
                                        <p className="text-gray-500 text-sm">몇 초 이내로 답변을 받을 수 있어요</p>
                                    </div>
                                </div>

                                {/* 채팅 메시지 컨테이너 */}
                                <div className="h-[calc(470px-120px)] overflow-y-auto pr-2">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.sender === "user" ? "justify-end" : "justify-start"
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
                                            </div>
                                        </div>
                                    ))}
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

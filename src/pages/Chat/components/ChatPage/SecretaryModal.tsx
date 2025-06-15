import type { FC } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SecretaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    hideCloseButton?: boolean;
}

const SecretaryModal: FC<SecretaryModalProps> = ({
    isOpen,
    onClose,
    hideCloseButton,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 모달 박스만 중앙에 띄움 */}
                    <motion.div
                        className="fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div
                            className="bg-white w-[90%] max-w-[320px] rounded-2xl shadow-none p-6 relative font-GanwonEduAll_Light"
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
                                {/* 타임스탬프 */}
                                <p className="text-center text-gray-400 text-sm my-4">오늘 08:30 PM</p>
                                {/* 챗봇 메시지 */}
                                <div className="flex justify-start mb-4">
                                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[80%]">
                                        <p>안녕, 반가워~</p>
                                        <p>난 채팅을 도와주는 너만의 비서 봇이야!</p>
                                        <p>친구와 대화하면서 어렵거나 궁금하거나 어떤 것이든 편하게 물어봐!!</p>
                                    </div>
                                </div>
                                {/* 사용자 메시지 */}
                                <div className="flex justify-end mb-4">
                                    <div className="bg-gray-800 text-white p-3 rounded-lg max-w-[80%]">
                                        <p>같이 게임하자고 물어봤는데 1시간 째 답이 없어. 내가 뭐 실수한 걸까?</p>
                                    </div>
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

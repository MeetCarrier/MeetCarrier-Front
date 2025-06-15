import { useState, useEffect } from "react";
import Modal from "../../../components/Modal";

interface ChatGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatGuideModal = ({ isOpen, onClose }: ChatGuideModalProps) => {
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  const handleConfirm = () => {
    if (doNotShowAgain) {
      localStorage.setItem("hideChatGuideModal", "true");
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-lg font-bold text-[#333333]">
          채팅 활성화 시간에 관하여
        </p>
        <p className="text-sm text-[#555555] leading-relaxed whitespace-pre-line">
          채팅방은 24시간 동안만 유지됩니다.
          <br />
          해당 시간 후에는 채팅이 금지되며 만남 단계가 자동으로 종료됩니다.
          <br />
          <span className="font-semibold text-[#BD4B2C]">만남 초대장</span>을
          보내서 인연을 이어가보세요!
        </p>

        <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <input
            type="checkbox"
            checked={doNotShowAgain}
            onChange={(e) => setDoNotShowAgain(e.target.checked)}
          />
          다음 로그인까지 보지 않기
        </label>

        <button
          onClick={handleConfirm}
          className="mt-2 px-6 py-2 rounded-md bg-[#BD4B2C] text-white text-sm font-semibold"
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

export default ChatGuideModal;

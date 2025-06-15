import type { FC } from "react";
import Modal from "../../../../components/Modal";

interface ChatGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatGuideModal: FC<ChatGuideModalProps> = ({ isOpen, onClose }) => {
  const handleClose = () => {
    localStorage.setItem("hideChatGuideModal", "true");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} hideCloseButton>
      <div className="flex flex-col items-end text-left gap-4">
        <h1 className="w-full text-xl text-[#333333] leading-relaxed whitespace-pre-line font-GanwonEduAll_Bold">
          채팅 활성화 시간에 관하여
        </h1>

        <p className="text-sm text-[#333333] leading-relaxed whitespace-pre-line font-GanwonEduAll_Light">
          채팅방은 <span className="font-bold">24시간</span> 동안만 유지됩니다.
          <br />
          해당 시간 후에는 채팅이 금지되며 만남 단계가 자동으로 종료됩니다.
          <br />
          <span className="font-bold text-[#BD4B2C]">만남 초대장</span>을 보내서
          인연을 이어 가보세요!
        </p>

        <button
          onClick={handleClose}
          className="mt-2 px-6 py-1.5 rounded-md bg-[#BD4B2C] text-white text-sm font-semibold"
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

export default ChatGuideModal;

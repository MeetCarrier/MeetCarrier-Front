import { FC } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

interface MeetingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  matchId?: number;
  myId?: number;
  roomId?: number;
  senderName?: string;
  recipientName?: string;
}

const MeetingInfoModal: FC<MeetingInfoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  matchId,
  myId,
  roomId,
  senderName,
  recipientName,
}) => {
  const navigate = useNavigate();

  const handleModifyClick = () => {
    navigate("/meeting-schedule", {
      state: {
        senderName,
        recipientName,
        matchId,
        receiverId: myId,
        roomId,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="items-end text-left text-[#333] font-GanwonEduAll_Light">
        <h2 className="text-xl font-bold mb-4 ">만남 일정에 관해</h2>
        <p className="text-sm text-gray-700 mb-4">
          만남 일정은 상호 동의 하에 실제로 만날 날을 정한 일정입니다.
          <br />
          일정 변경은 <strong className="text-[#D45A4B]">최대 3회</strong>만
          가능합니다.
        </p>
        <p className="text-sm text-gray-700 mb-6">
          노쇼 등으로 약속을 불이행한 경우 서비스 사용에 제약이 있을 수
          있습니다.
        </p>
        <div className="flex justify-around space-x-4">
          <button
            onClick={handleModifyClick}
            className="flex-1 py-2 px-4 rounded-md text-gray-700 hover:bg-gray-100"
          >
            일정 변경
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#D45A4B] text-white py-2 px-4 rounded-md hover:bg-[#bf4a3c]"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MeetingInfoModal;

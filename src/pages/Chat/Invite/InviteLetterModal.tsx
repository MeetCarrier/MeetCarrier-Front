import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal";
import stamp from "../../../assets/img/stamp.svg";
import letterBg from "../../../assets/img/icons/Letter/letter.svg";
import sampleProfile from "../../../assets/img/sample/sample_profile.svg";

interface InviteLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
  recipientName: string;
  senderProfile?: string;
  onSubmit: () => void;
  matchId: number;
  receiverId: number;
  roomId: number;
}

const InviteLetterModal: FC<InviteLetterModalProps> = ({
  isOpen,
  onClose,
  senderName,
  recipientName,
  senderProfile = sampleProfile,
  onSubmit,
  matchId,
  receiverId,
  roomId,
}) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/invite-write", {
      state: {
        senderName,
        recipientName,
        senderProfile,
        matchId,
        receiverId,
        roomId,
      },
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-g font-semibold">대면 초대장을 보내시겠어요?</h2>

        <div
          className="relative w-full max-w-[360px] h-[180px] bg-contain bg-no-repeat bg-center p-5"
          style={{ backgroundImage: `url(${letterBg})` }}
        >
          {/* 보낸이 */}
          <div className="absolute left-7 top-6 text-xs text-left flex items-center gap-2">
            <div>
              <p className="text-gray-500">보낸이</p>
              <p className="font-semibold">{senderName}</p>
            </div>
          </div>

          {/* 받는이 */}
          <div className="absolute right-7 bottom-6 text-xs text-left">
            <p className="text-gray-500">받는이</p>
            <p className="font-semibold">{recipientName}</p>
          </div>

          {/* 우표 + 보낸이 프로필 이미지 */}
          <div className="absolute top-6 right-7 w-[48px] h-[48px]">
            {/* stamp 이미지 (배경) */}
            <img
              src={stamp}
              alt="stamp"
              className="w-full h-full rounded-md object-cover"
            />

            {/* senderProfile 이미지 (중앙 오버레이) */}
            <img
              src={senderProfile}
              alt="보낸이 프로필"
              className="absolute top-1/2 left-1/2 w-9 h-9 rounded-[2px] object-cover transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <p className="text-sm text-gray-600">
          대면 초대장을 보내 <br />
          친구와 실제로 만남을 가져보세요!
        </p>

        <div className="flex justify-between gap-4 w-full mt-2">
          <button
            className="flex-1 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 py-2 bg-[#D45A4B] text-white rounded-md hover:bg-[#bf4a3c] transition"
            onClick={handleSubmit}
          >
            초대장쓰기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteLetterModal;

import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Utils/store";
import Modal from "../../../components/Modal";
import stamp from "../../../assets/img/stamp.svg";
import letterBg from "../../../assets/img/icons/Letter/letter.svg";
import sampleProfile from "../../../assets/img/sample/sample_profile.svg";
import { MatchData, RoomInfo } from "../components/ChatPage/types";

interface InviteLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
  recipientName: string;
  senderProfile: string;
  matchData: MatchData | null;
  roomInfo: RoomInfo | null;
  matchId: number;
  receiverId: number;
  roomId: number;
  myId: number | undefined;
  invitationStatus: {
    exists: boolean;
    isSender: boolean;
    isReceiver: boolean;
    status?: "PENDING" | "ACCEPTED" | "REJECTED";
  } | null;
  loadingInvitation: boolean;
}

const InviteLetterModal: FC<InviteLetterModalProps> = ({
  isOpen,
  onClose,
  senderName,
  recipientName,
  senderProfile = sampleProfile,
  matchId,
  receiverId,
  roomId,
  myId: propMyId,
  invitationStatus,
  loadingInvitation,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user) as {
    userId?: number;
  } | null;
  const myId = propMyId || user?.userId;

  useEffect(() => {
    if (isOpen) {
      console.log(
        "[InviteLetterModal] 모달 열림, 전달받은 초대장 상태:",
        invitationStatus
      );
      if (invitationStatus) {
        console.log("[InviteLetterModal] 현재 상태 상세:", {
          isSender: invitationStatus.isSender ? "발신자" : "수신자",
          status:
            invitationStatus.status === "PENDING"
              ? "대기중"
              : invitationStatus.status === "ACCEPTED"
              ? "수락됨"
              : invitationStatus.status === "REJECTED"
              ? "거절됨"
              : "상태 없음",
        });
      } else {
        console.log("[InviteLetterModal] 초대장 상태 없음 (null)");
      }
    }
  }, [isOpen, invitationStatus]);

  const handleSubmit = () => {
    navigate("/invite-write", {
      state: {
        senderName,
        recipientName,
        senderProfile,
        matchId,
        receiverId,
        roomId,
        myId,
      },
    });
    onClose();
  };

  const getStatusMessage = () => {
    if (!invitationStatus) return null;

    const { exists, isSender, isReceiver, status } = invitationStatus;

    if (!exists) {
      return "대면 초대장을 보내 친구와 실제로 만남을 가져보세요!";
    }

    if (isSender) {
      if (status === "PENDING") return "초대장을 보냈어요! 기다리세요!";
      if (status === "ACCEPTED") return "초대장이 수락되었어요!";
      if (status === "REJECTED") return "초대장이 거절되었어요.";
    }

    if (isReceiver) {
      if (status === "PENDING") return "초대장이 도착했어요!";
      if (status === "ACCEPTED") return "초대장을 수락했어요!";
      if (status === "REJECTED") return "초대장을 거절했어요.";
    }

    return null;
  };

  const getModalTitle = () => {
    if (!invitationStatus) return "대면 초대장을 보내시겠어요?";

    const { exists, isSender, isReceiver, status } = invitationStatus;

    if (exists) {
      if (isSender) {
        if (status === "PENDING") return "이미 초대장을 보냈어요!";
        if (status === "ACCEPTED") return "초대장이 수락되었어요!";
        if (status === "REJECTED") return "초대장이 거절되었어요.";
      }
      if (isReceiver) {
        if (status === "PENDING") return "초대장이 도착했어요!";
        if (status === "ACCEPTED") return "초대장을 수락했어요!";
        if (status === "REJECTED") return "초대장을 거절했어요.";
      }
    }

    return "대면 초대장을 보내시겠어요?";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-g font-semibold">{getModalTitle()}</h2>

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
            <img
              src={stamp}
              alt="stamp"
              className="w-full h-full rounded-md object-cover"
            />
            <img
              src={senderProfile}
              alt="보낸이 프로필"
              className="absolute top-1/2 left-1/2 w-9 h-9 rounded-[2px] object-cover transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {loadingInvitation ? (
          <p className="text-sm text-gray-600">
            초대장 정보를 확인 중입니다...
          </p>
        ) : (
          <p className="text-sm text-gray-600">{getStatusMessage()}</p>
        )}

        <div className="flex justify-between gap-4 w-full mt-2">
          <button
            className="flex-1 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={onClose}
          >
            닫기
          </button>
          <button
            className="flex-1 py-2 bg-[#D45A4B] text-white rounded-md hover:bg-[#bf4a3c] transition"
            onClick={handleSubmit}
          >
            확인하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteLetterModal;

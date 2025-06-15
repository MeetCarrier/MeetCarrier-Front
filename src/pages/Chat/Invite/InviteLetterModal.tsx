import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Utils/store";
import axios from "axios";
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
  matchId: number;
  receiverId: number;
  roomId: number;
  myId?: number;
  invitationStatus: {
    exists: boolean;
    isSender: boolean;
    isReceiver: boolean;
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

  const handleSubmit = () => {
    const { exists, isSender, isReceiver } = invitationStatus || {
      exists: false,
      isSender: false,
      isReceiver: false,
    };

    if (exists && !isReceiver) return;

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
          <>
            {invitationStatus?.exists ? (
              invitationStatus.isSender ? (
                <p className="text-sm text-red-500 mt-2">
                  이미 초대장을 보냈어요! 기다리세요!
                </p>
              ) : invitationStatus.isReceiver ? (
                <p className="text-sm text-gray-600 mt-2">
                  초대장이 도착했어요!
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  대면 초대장을 보내 <br />
                  친구와 실제로 만남을 가져보세요!
                </p>
              )
            ) : (
              <p className="text-sm text-gray-600">
                대면 초대장을 보내 <br />
                친구와 실제로 만남을 가져보세요!
              </p>
            )}
          </>
        )}

        <div className="flex justify-between gap-4 w-full mt-2">
          <button
            className="flex-1 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition ${
              invitationStatus?.exists && !invitationStatus?.isReceiver
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-[#D45A4B] text-white hover:bg-[#bf4a3c]"
            }`}
            onClick={handleSubmit}
            disabled={invitationStatus?.exists && !invitationStatus?.isReceiver}
          >
            {invitationStatus?.isReceiver ? "초대장 보러가기" : "초대장쓰기"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteLetterModal;

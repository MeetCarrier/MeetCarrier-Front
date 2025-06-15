import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import alarmClockIcon from "../../../assets/img/icons/ChatIcon/alarm_clock.svg";
import alarmCalIcon from "../../../assets/img/icons/ChatIcon/alarm_cal.svg";
import alarmLetterIcon from "../../../assets/img/icons/ChatIcon/alarm_letter.svg";
import arrowIcon from "../../../assets/img/icons/ChatIcon/ic_arrow.svg";
import MeetingInfoModal from "../../../components/MeetingInfoModal";

interface MeetingInfo {
  id: number;
  nickname: string;
  date: string;
  location: string;
  note: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

interface ChatNotificationBarProps {
  type: "time" | "schedule";
  time?: string; // "20시 21분 01초" 형식
  scheduleDate?: string; // "10월 25일" 형식
  location?: string;
  memo?: string;
  isScheduled: boolean; // 일정이 등록되었는지 여부
  onModifyClick?: () => void;
  isRoomActive: boolean;
  deactivationDate?: string;
  invitationStatus?: {
    exists: boolean;
    isSender: boolean;
    isReceiver: boolean;
    status?: "PENDING" | "ACCEPTED" | "REJECTED";
  } | null;
  onInviteClick?: () => void;
  matchId?: number;
}

const ChatNotificationBar: FC<ChatNotificationBarProps> = ({
  type,
  time,
  scheduleDate,
  location,
  memo,
  isScheduled,
  onModifyClick,
  isRoomActive,
  deactivationDate,
  invitationStatus,
  onInviteClick,
  matchId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetingInfo = async () => {
      if (invitationStatus?.status === "ACCEPTED" && matchId) {
        try {
          const response = await fetch(`/api/meetings/${matchId}`);
          if (response.ok) {
            const data = await response.json();
            setMeetingInfo(data);
          }
        } catch (error) {
          console.error("Failed to fetch meeting info:", error);
        }
      }
    };

    fetchMeetingInfo();
  }, [invitationStatus?.status, matchId]);

  const displayIcon = () => {
    if (invitationStatus?.exists) {
      if (invitationStatus.status === "PENDING") {
        return alarmLetterIcon;
      } else if (invitationStatus.status === "ACCEPTED") {
        return alarmCalIcon;
      }
    }
    return isScheduled
      ? alarmCalIcon
      : type === "time"
      ? alarmClockIcon
      : alarmCalIcon;
  };

  let displayText = "";
  if (invitationStatus?.exists) {
    if (invitationStatus.isSender) {
      switch (invitationStatus.status) {
        case "PENDING":
          displayText = "초대장 결과를 기다려봐요!";
          break;
        case "ACCEPTED":
          displayText = "초대장이 수락되었어요! 일정을 조율해보세요!";
          break;
        case "REJECTED":
          displayText = "초대장이 거절되었어요. 다시 시도해보세요!";
          break;
        default:
          displayText = "초대장 결과를 기다려봐요!";
      }
    } else if (invitationStatus.isReceiver) {
      switch (invitationStatus.status) {
        case "PENDING":
          displayText = "초대장을 받았어요! 확인하러 가요!";
          break;
        case "ACCEPTED":
          if (meetingInfo) {
            const date = new Date(meetingInfo.date);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
            const weekday = weekdays[date.getDay()];
            displayText = `만남 일정: ${month}월 ${day}일 ${weekday}요일`;
          } else if (deactivationDate) {
            const date = new Date(deactivationDate);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            displayText = `${month}월 ${day}일까지 만남 일정을 등록해주세요!!!`;
          } else {
            displayText = "초대장을 수락했어요! 일정을 조율해보세요!";
          }
          break;
        case "REJECTED":
          displayText = "초대장을 거절했어요.";
          break;
        default:
          displayText = "초대장을 받았어요! 확인하러 가요!";
      }
    }
  } else {
    displayText = isScheduled
      ? `만남 일정 : ${scheduleDate}`
      : type === "time"
      ? isRoomActive
        ? `채팅 활성화 시간: ${time}`
        : "채팅이 비활성화되었습니다"
      : `${scheduleDate}까지 만남 일정을 등록해주세요!!!`;
  }

  const handleBarClick = () => {
    if (
      invitationStatus?.exists &&
      invitationStatus.isReceiver &&
      invitationStatus.status === "ACCEPTED"
    ) {
      if (meetingInfo) {
        setIsModalOpen(true);
      } else {
        navigate("/meeting-schedule");
      }
    } else if (
      invitationStatus?.exists &&
      invitationStatus.isReceiver &&
      invitationStatus.status === "PENDING"
    ) {
      onInviteClick?.();
    } else if (isScheduled) {
      setIsExpanded((prev) => !prev);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/meeting-schedule");
  };

  return (
    <div className="absolute top-[100px] px-2 mx-auto w-full z-10 text-[#333] font-GanwonEduAll_Light text-l">
      <div
        className={`flex flex-col py-3 ${
          isRoomActive ? "bg-[#D9CDBF]" : "bg-gray-400"
        } rounded-lg shadow-md cursor-pointer`}
        onClick={handleBarClick}
      >
        <div className="flex items-center justify-start">
          <img
            src={displayIcon()}
            alt="notification icon"
            className="w-5 h-5 ml-3 mr-3"
          />
          <p className="font-semibold flex-grow">{displayText}</p>
        </div>
        {type === "time" && (
          <div className="flex items-center justify-start mt-1">
            <img
              src={alarmClockIcon}
              alt="time icon"
              className="w-5 h-5 ml-3 mr-3"
            />
            <p className="font-semibold">
              {isRoomActive
                ? `채팅 활성화 시간: ${time}`
                : "채팅이 비활성화되었습니다"}
            </p>
          </div>
        )}
      </div>

      {isExpanded &&
        (isScheduled ||
          (invitationStatus?.exists &&
            invitationStatus.status === "ACCEPTED")) && (
          <div className="bg-white rounded-lg shadow-md p-4 mt-2 border border-gray-200">
            <p className="mb-1">
              <strong className="font-bold">날짜:</strong> {scheduleDate}
            </p>
            <p className="mb-1">
              <strong className="font-bold">장소:</strong> {location}
            </p>
            <p className="mb-3">
              <strong className="font-bold">메모:</strong> {memo || "없음"}
            </p>
            <div className="flex justify-end">
              <button
                onClick={onModifyClick}
                className={`${
                  isRoomActive
                    ? "bg-[#D45A4B] hover:bg-[#bf4a3c]"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-4 py-2 rounded-md font-semibold`}
                disabled={!isRoomActive}
              >
                수정
              </button>
            </div>
          </div>
        )}

      <MeetingInfoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default ChatNotificationBar;

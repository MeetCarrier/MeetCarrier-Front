import type { FC } from "react";
import alarmClockIcon from "../../../assets/img/icons/ChatIcon/alarm_clock.svg";
import alarmCalIcon from "../../../assets/img/icons/ChatIcon/alarm_cal.svg";
import alarmLetterIcon from "../../../assets/img/icons/ChatIcon/alarm_letter.svg";
import MeetingInfoModal from "../../../components/MeetingInfoModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type NotificationType =
  | "NO_INVITATION"
  | "PENDING"
  | "NEED_SCHEDULE"
  | "PENDING_SCHEDULE"
  | "SCHEDULED"
  | "REJECTED_SCHEDULE";

interface ChatNotificationBarProps {
  type: NotificationType;
  isSender: boolean;
  senderName: string;
  recipientName: string;
  remainingTime: string;
  meetingDate?: Date;
  deactivationTime?: string;
  onScheduleMeeting?: () => void;
  onModifySchedule?: () => void;
  matchId?: number;
  myId?: number;
  roomId?: number;
  meetingId?: number;
  isMeetingSender?: boolean;
  updateCount?: number;
}

const ChatNotificationBar: FC<ChatNotificationBarProps> = ({
  type,
  isSender,
  senderName,
  recipientName,
  remainingTime,
  meetingDate,
  deactivationTime,
  onScheduleMeeting,
  onModifySchedule,
  matchId,
  myId,
  roomId,
  meetingId,
  isMeetingSender,
  updateCount,
}) => {
  const [showMeetingInfoModal, setShowMeetingInfoModal] = useState(false);
  const navigate = useNavigate();

  const getNotificationMessage = () => {
    switch (type) {
      case "NO_INVITATION":
        return "";
      case "PENDING":
        if (isSender) {
          return `${recipientName}님이 결정하고 있어요.`;
        }
        return `${senderName}님이 초대장을 보냈어요. 확인해주세요!`;
      case "NEED_SCHEDULE":
        if (deactivationTime) {
          const deadline = new Date(deactivationTime);
          const month = deadline.getMonth() + 1;
          const day = deadline.getDate();
          return `${month}월 ${day}일까지 만남 일정을 등록해주세요!!`;
        }
        return `만남 일정을 등록해주세요!!`;
      case "PENDING_SCHEDULE":
        return isMeetingSender
          ? "상대방이 만남 일정을 검토중입니다"
          : "만남 일정을 확인해주세요!";
      case "SCHEDULED": {
        const scheduleText = `만남 일정: ${
          meetingDate?.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
          }) ?? ""
        }`;
        const suffix =
          updateCount !== undefined && updateCount > 0
            ? "(수정 가능)"
            : "(수정 불가)";
        return `${scheduleText} ${suffix}`;
      }
      case "REJECTED_SCHEDULE":
        return isMeetingSender
          ? "상대방이 일정을 거절했습니다. 수정해주세요."
          : "일정을 거절했습니다.";
      default:
        return "";
    }
  };

  const getNotificationIcon = () => {
    switch (type) {
      case "NO_INVITATION":
        return alarmClockIcon;
      case "PENDING":
        return alarmLetterIcon;
      case "NEED_SCHEDULE":
      case "SCHEDULED":
        return alarmCalIcon;
      case "PENDING_SCHEDULE":
        return alarmCalIcon;
      case "REJECTED_SCHEDULE":
        return alarmCalIcon;
      default:
        return alarmClockIcon;
    }
  };

  const handleClick = () => {
    if (type === "NEED_SCHEDULE" && onScheduleMeeting) {
      onScheduleMeeting();
    } else if (type === "SCHEDULED") {
      if (updateCount !== undefined && updateCount > 0) {
        setShowMeetingInfoModal(true);
      }
    } else if (type === "PENDING_SCHEDULE") {
      if (!isMeetingSender) {
        navigate("/meeting-schedule", {
          state: {
            matchId,
            meetingId,
            isConfirm: true,
          },
        });
      }
    } else if (type === "REJECTED_SCHEDULE") {
      if (isMeetingSender && onModifySchedule) {
        onModifySchedule();
      }
    }
  };

  const handleModifySchedule = () => {
    setShowMeetingInfoModal(false);
    if (onModifySchedule) {
      onModifySchedule();
    }
  };

  return (
    <>
      <div className="absolute top-[100px] px-2 mx-auto w-full z-10 text-[#333] font-GanwonEduAll_Light text-l">
        <div
          className={`flex flex-col py-3 bg-[#D9CDBF] rounded-lg shadow-md ${
            type === "NEED_SCHEDULE" ||
            (type === "SCHEDULED" &&
              updateCount !== undefined &&
              updateCount > 0) ||
            (type === "PENDING_SCHEDULE" && !isMeetingSender) ||
            (type === "REJECTED_SCHEDULE" && isMeetingSender)
              ? "cursor-pointer hover:bg-[#d3c5b3]"
              : ""
          }`}
          onClick={handleClick}
        >
          {type !== "NO_INVITATION" && (
            <div className="flex items-center justify-start">
              <img
                src={getNotificationIcon()}
                alt="notification icon"
                className="w-5 h-5 ml-3 mr-3"
              />
              <p
                className={`font-semibold flex-grow whitespace-pre-line ${
                  type === "NEED_SCHEDULE" ||
                  (type === "SCHEDULED" &&
                    updateCount !== undefined &&
                    updateCount > 0) ||
                  (type === "PENDING_SCHEDULE" && !isMeetingSender) ||
                  (type === "REJECTED_SCHEDULE" && isMeetingSender)
                    ? "underline"
                    : ""
                }`}
              >
                {getNotificationMessage()}
              </p>
            </div>
          )}
          <div className="flex items-center justify-start">
            <img
              src={alarmClockIcon}
              alt="notification icon"
              className="w-5 h-5 ml-3 mr-3"
            />
            <p className="font-semibold flex-grow whitespace-pre-line">
              채팅 활성화 시간: {remainingTime}
            </p>
          </div>
        </div>
      </div>

      <MeetingInfoModal
        isOpen={showMeetingInfoModal}
        onClose={() => setShowMeetingInfoModal(false)}
        onConfirm={handleModifySchedule}
        matchId={matchId}
        myId={myId}
        roomId={roomId}
        senderName={senderName}
        recipientName={recipientName}
        updateCount={updateCount}
      />
    </>
  );
};

export default ChatNotificationBar;

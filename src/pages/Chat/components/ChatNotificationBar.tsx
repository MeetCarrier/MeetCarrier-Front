import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import alarmClockIcon from "../../../assets/img/icons/ChatIcon/alarm_clock.svg";
import alarmCalIcon from "../../../assets/img/icons/ChatIcon/alarm_cal.svg";
import alarmLetterIcon from "../../../assets/img/icons/ChatIcon/alarm_letter.svg";

export type NotificationType =
  | "NO_INVITATION"
  | "PENDING"
  | "NEED_SCHEDULE"
  | "SCHEDULED";

interface ChatNotificationBarProps {
  type: NotificationType;
  isSender: boolean;
  senderName: string;
  recipientName: string;
  remainingTime: string;
  meetingDate?: Date;
  onSendInvitation?: () => void;
  onAcceptInvitation?: () => void;
  onRejectInvitation?: () => void;
  onScheduleMeeting?: () => void;
  onModifySchedule?: () => void;
}

const ChatNotificationBar: FC<ChatNotificationBarProps> = ({
  type,
  isSender,
  senderName,
  recipientName,
  remainingTime,
  meetingDate,
  onSendInvitation,
  onAcceptInvitation,
  onRejectInvitation,
  onScheduleMeeting,
  onModifySchedule,
}) => {
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
        return `~월 ~일까지 만남 일정을 등록해주세요!!`;
      case "SCHEDULED":
        return `만남 일정: ${
          meetingDate?.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
          }) ?? ""
        }`;
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
      default:
        return alarmClockIcon;
    }
  };

  const renderActionButtons = () => {
    switch (type) {
      case "NO_INVITATION":
        return;
      case "PENDING":
        return;
      case "NEED_SCHEDULE":
        return null;
      case "SCHEDULED":
        return (
          <button
            onClick={onModifySchedule}
            className="mt-2 border border-[#D45A4B] text-[#D45A4B] px-4 py-2 rounded-md hover:bg-[#fff5f5]"
          >
            일정 수정
          </button>
        );
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (type === "NEED_SCHEDULE" && onScheduleMeeting) {
      onScheduleMeeting();
    } else if (type === "SCHEDULED" && onModifySchedule) {
      onModifySchedule();
    }
  };

  return (
    <div className="absolute top-[100px] px-2 mx-auto w-full z-10 text-[#333] font-GanwonEduAll_Light text-l">
      <div
        className={`flex flex-col py-3 bg-[#D9CDBF] rounded-lg shadow-md ${
          type === "NEED_SCHEDULE" || type === "SCHEDULED"
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
            <p className="font-semibold flex-grow whitespace-pre-line">
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
  );
};

export default ChatNotificationBar;

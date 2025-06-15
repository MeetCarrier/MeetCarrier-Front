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
        return `⏱ 채팅 활성화 시간: ${remainingTime}`;
      case "PENDING":
        if (isSender) {
          return `초대장을 보냈어요! ${recipientName}님이 초대를 확인하실 때까지 기다려주세요!\n⏱ 채팅 활성화 시간: ${remainingTime}`;
        }
        return `${senderName}님이 초대장을 보냈어요. 확인해주세요!\n⏱ 채팅 활성화 시간: ${remainingTime}`;
      case "NEED_SCHEDULE":
        return `~월 ~일까지 만남 일정을 등록해주세요!!\n⏱ 채팅 활성화 시간: ${remainingTime}`;
      case "SCHEDULED":
        return `만남 일정: ${meetingDate?.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "long",
        })}\n⏱ 채팅 활성화 시간: ${remainingTime}`;
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
        return (
          <button
            onClick={onSendInvitation}
            className="mt-2 bg-[#D45A4B] text-white px-4 py-2 rounded-md hover:bg-[#bf4a3c]"
          >
            초대장 보내기
          </button>
        );
      case "PENDING":
        if (!isSender) {
          return (
            <div className="mt-2 flex gap-2">
              <button
                onClick={onAcceptInvitation}
                className="flex-1 bg-[#D45A4B] text-white px-4 py-2 rounded-md hover:bg-[#bf4a3c]"
              >
                수락하기
              </button>
              <button
                onClick={onRejectInvitation}
                className="flex-1 border border-[#D45A4B] text-[#D45A4B] px-4 py-2 rounded-md hover:bg-[#fff5f5]"
              >
                거절하기
              </button>
            </div>
          );
        }
        return null;
      case "NEED_SCHEDULE":
        return (
          <button
            onClick={onScheduleMeeting}
            className="mt-2 bg-[#D45A4B] text-white px-4 py-2 rounded-md hover:bg-[#bf4a3c]"
          >
            일정 등록하기
          </button>
        );
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

  return (
    <div className="absolute top-[100px] px-2 mx-auto w-full z-10 text-[#333] font-GanwonEduAll_Light text-l">
      <div className="flex flex-col py-3 bg-[#D9CDBF] rounded-lg shadow-md">
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
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default ChatNotificationBar;

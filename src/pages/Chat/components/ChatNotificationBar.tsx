import type { FC } from "react";
import alarmClockIcon from "../../../assets/img/icons/ChatIcon/alarm_clock.svg";
import alarmCalIcon from "../../../assets/img/icons/ChatIcon/alarm_cal.svg";

interface ChatNotificationBarProps {
  type: "time" | "schedule";
  time?: string; // "20시 21분 01초" 형식
  scheduleDate?: string; // "10월 25일" 형식
  isScheduled: boolean; // 일정이 등록되었는지 여부
  onClick?: () => void; // 클릭 이벤트 핸들러
}

const ChatNotificationBar: FC<ChatNotificationBarProps> = ({
  type,
  time,
  scheduleDate,
  isScheduled,
  onClick,
}) => {
  const displayIcon = isScheduled
    ? alarmCalIcon
    : type === "time"
    ? alarmClockIcon
    : alarmCalIcon;
  const displayText = isScheduled
    ? `만남 일정 : ${scheduleDate}`
    : type === "time"
    ? `채팅 활성화 시간: ${time}`
    : `${scheduleDate}까지 만남 일정을 등록해주세요!!!`;

  return (
    <div
      className="absolute top-[100px] left-0 right-0 px-6 py-3 bg-[#D9CDBF] rounded-lg shadow-md mx-auto w-[calc(100%-48px)] flex items-center justify-start z-10 cursor-pointer"
      onClick={onClick}
    >
      <img src={displayIcon} alt="notification icon" className="w-5 h-5 mr-3" />
      <p className="text-[#333333] text-sm font-semibold">{displayText}</p>
    </div>
  );
};

export default ChatNotificationBar;

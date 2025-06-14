import type { FC } from "react";
import { useState } from "react";
import alarmClockIcon from "../../../assets/img/icons/ChatIcon/alarm_clock.svg";
import alarmCalIcon from "../../../assets/img/icons/ChatIcon/alarm_cal.svg";
import arrowIcon from "../../../assets/img/icons/ChatIcon/ic_arrow.svg";

interface ChatNotificationBarProps {
  type: "time" | "schedule";
  time?: string; // "20시 21분 01초" 형식
  scheduleDate?: string; // "10월 25일" 형식
  location?: string;
  memo?: string;
  isScheduled: boolean; // 일정이 등록되었는지 여부
  onModifyClick?: () => void;
  isRoomActive: boolean;
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayIcon = isScheduled
    ? alarmCalIcon
    : type === "time"
    ? alarmClockIcon
    : alarmCalIcon;
  const displayText = isScheduled
    ? `만남 일정 : ${scheduleDate}`
    : type === "time"
    ? isRoomActive
      ? `채팅 활성화 시간: ${time}`
      : "채팅이 비활성화되었습니다"
    : `${scheduleDate}까지 만남 일정을 등록해주세요!!!`;

  const handleBarClick = () => {
    if (isScheduled) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className="absolute top-[100px] px-2 mx-auto w-full z-10">
      <div
        className={`flex items-center justify-start py-3 ${
          isRoomActive ? "bg-[#D9CDBF]" : "bg-gray-400"
        } rounded-lg shadow-md cursor-pointer`}
        onClick={handleBarClick}
      >
        <img
          src={displayIcon}
          alt="notification icon"
          className="w-5 h-5 ml-3 mr-3"
        />
        <p className="text-[#333333] text-sm font-semibold flex-grow">
          {displayText}
        </p>
        {isScheduled && (
          <img
            src={arrowIcon}
            alt="toggle arrow"
            className={`w-4 h-4 mr-3 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
      </div>

      {isExpanded && isScheduled && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-2 border border-gray-200">
          <p className="text-sm text-gray-700 mb-1">
            <strong className="font-bold">날짜:</strong> {scheduleDate}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            <strong className="font-bold">장소:</strong> {location}
          </p>
          <p className="text-sm text-gray-700 mb-3">
            <strong className="font-bold">메모:</strong> {memo || "없음"}
          </p>
          <div className="flex justify-end">
            <button
              onClick={onModifyClick}
              className={`${
                isRoomActive
                  ? "bg-[#D45A4B] hover:bg-[#bf4a3c]"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white px-4 py-2 rounded-md text-sm font-semibold`}
              disabled={!isRoomActive}
            >
              수정
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNotificationBar;

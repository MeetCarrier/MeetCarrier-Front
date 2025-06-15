import { ChatMessage as ChatMessageType } from "./types";
import chatBot from "../../../../assets/img/icons/Chat/chatBot.svg";

interface ChatMessageProps {
  msg: ChatMessageType;
  isMine: boolean;
  isPrevSameSender: boolean;
  currentNickname: string;
  currentProfileUrl: string;
  koreanTime: Date;
  shouldDisplayTime: boolean;
  isHighlighted: boolean;
  isCurrent: boolean;
  onProfileClick: (senderId: number) => void;
  messageRef: (el: HTMLDivElement | null) => void;
  messageType: string;
  searchQuery?: string;
}

export const ChatMessage = ({
  msg,
  isMine,
  isPrevSameSender,
  currentNickname,
  currentProfileUrl,
  koreanTime,
  shouldDisplayTime,
  isHighlighted,
  isCurrent,
  onProfileClick,
  messageRef,
  messageType,
  searchQuery = "",
}: ChatMessageProps) => {
  const getMessageStyle = () => {
    switch (messageType) {
      case "my-normal-message":
        return "bg-[#BD4B2C] text-[#F2F2F2] rounded-br-none";
      case "my-chatbot-question":
      case "opponent-chatbot-question":
      case "chatbot-response-to-me":
      case "chatbot-response-to-opponent":
        return "bg-[#666] text-white rounded-br-none";
      case "opponent-normal-message":
        return "bg-[#FFFFFF] text-[#333333] rounded-bl-none";
      default:
        return "";
    }
  };

  const getMessageAlignment = () => {
    switch (messageType) {
      case "my-normal-message":
      case "my-chatbot-question":
        return "justify-end";
      default:
        return "justify-start";
    }
  };

  const getProfileImage = () => {
    switch (messageType) {
      case "chatbot-response-to-me":
      case "chatbot-response-to-opponent":
        return chatBot;
      default:
        return currentProfileUrl;
    }
  };

  const getDisplayName = () => {
    switch (messageType) {
      case "chatbot-response-to-me":
      case "chatbot-response-to-opponent":
        return "만남배달부 봇";
      default:
        return currentNickname;
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark
              key={index}
              className={`${
                isCurrent
                  ? "bg-[#EADCCB] text-[#333] font-bold"
                  : "bg-[#EADCCB] text-[#333]"
              } px-0.5 rounded`}
            >
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  // 챗봇의 자동 응답인 경우 (type: CHATBOT, chatbot: true)
  if (msg.type === "CHATBOT" && msg.chatbot)
    return (
      <div ref={messageRef} className="w-full">
        <div className="flex justify-start mb-1">
          {/* 고정 너비의 프로필 영역 */}
          <div className="w-10 flex-shrink-0">
            <img
              src={chatBot}
              alt="챗봇 프로필"
              className="w-8 h-8 rounded-[2px] bg-white"
            />
          </div>

          {/* 메시지 컨테이너 */}
          <div className="flex flex-col items-start ml-2 flex-1 min-w-0">
            <span className="text-base text-gray-700 font-GanwonEduAll_Light mb-1">
              만남배달부 봇
            </span>
            <div className="flex items-end gap-1 w-full">
              <div className="px-3 py-2 rounded-xl whitespace-pre-wrap font-GanwonEduAll_Light bg-[#666] text-white rounded-bl-none max-w-[70%] break-words">
                <span className="text-lg font-medium">
                  {isHighlighted
                    ? highlightText(msg.message, searchQuery)
                    : msg.message}
                </span>
              </div>
              {shouldDisplayTime && (
                <div className="flex flex-col gap-y-0.5 text-xs text-gray-400 leading-tight font-GanwonEduAll_Light items-start ml-1 flex-shrink-0">
                  <span>
                    {koreanTime.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

  // 사용자의 챗봇 질문인 경우 (type: CHATBOT, chatbot: false)
  if (msg.type === "CHATBOT" && !msg.chatbot) {
    return (
      <div ref={messageRef} className="w-full">
        <div className="flex justify-end mb-1">
          <div className="flex flex-col items-end max-w-[85%]">
            <div className="flex items-end gap-1">
              {shouldDisplayTime && (
                <div className="flex flex-col gap-y-0.5 text-xs text-gray-400 leading-tight font-GanwonEduAll_Light items-end mr-1 flex-shrink-0">
                  <span className="whitespace-nowrap">
                    {koreanTime.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              )}
              <div className="px-3 py-2 rounded-xl whitespace-pre-wrap font-GanwonEduAll_Light bg-[#666] text-white rounded-br-none break-words">
                <span className="text-lg font-medium">
                  {isHighlighted
                    ? highlightText(msg.message, searchQuery)
                    : msg.message}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // visible이 false인 메시지는 표시하지 않음
  if (!msg.visible) {
    return null;
  }

  // 일반 메시지인 경우
  return (
    <div ref={messageRef} className="w-full">
      <div className={`flex ${getMessageAlignment()} mb-1`}>
        {!isMine && !isPrevSameSender ? (
          <div
            className="w-10 flex-shrink-0 cursor-pointer"
            onClick={() => onProfileClick(msg.sender)}
          >
            <img
              src={getProfileImage()}
              alt="프로필"
              className="w-8 h-8 rounded-[2px] bg-white object-cover"
            />
          </div>
        ) : (
          !isMine && <div className="w-10 flex-shrink-0" />
        )}

        <div
          className={`flex flex-col ${!isMine ? "ml-2" : ""} ${
            isMine ? "max-w-[85%]" : "flex-1 min-w-0"
          }`}
        >
          {!isMine && !isPrevSameSender && (
            <span className="text-base text-gray-700 mb-1 font-GanwonEduAll_Light">
              {getDisplayName()}
            </span>
          )}
          <div
            className={`flex items-end gap-1 ${
              isMine ? "flex-row-reverse" : "flex-row"
            } w-full`}
          >
            <div
              className={`px-3 py-2 rounded-xl whitespace-pre-wrap font-GanwonEduAll_Light ${
                msg.imageUrl ? "" : getMessageStyle()
              } ${isMine ? "" : "max-w-[70%]"} break-words`}
            >
              {msg.imageUrl ? (
                <img
                  src={msg.imageUrl}
                  alt="전송된 이미지"
                  className="max-w-full max-h-[150px] rounded-lg"
                />
              ) : (
                <span className="text-lg font-medium">
                  {isHighlighted
                    ? highlightText(msg.message, searchQuery)
                    : msg.message}
                </span>
              )}
            </div>

            {/* 시간 & 읽음 수 묶어서 위아래 정렬 */}
            <div
              className={`flex flex-col gap-y-0.5 text-xs font-GanwonEduAll_Light leading-tight flex-shrink-0 ${
                isMine
                  ? "items-end mr-1 text-right"
                  : "items-start ml-1 text-left"
              }`}
            >
              {/* 읽음 수 - 항상 위에 */}
              {isMine && !msg.read && (
                <span className="text-xs text-[#BD4B2C]">1</span>
              )}

              {/* 시간 - 조건부 표시 */}
              {shouldDisplayTime && (
                <span className="text-gray-400 whitespace-nowrap text-xs">
                  {koreanTime.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

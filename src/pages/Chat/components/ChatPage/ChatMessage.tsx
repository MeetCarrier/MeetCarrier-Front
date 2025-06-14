import { ChatMessage as ChatMessageType } from "./types";
import sampleProfile from "../../../../assets/img/sample/sample_profile.svg";
import chatBot from "../../../../assets/img/icons/Chat/chatBot.svg";

interface ChatMessageProps {
  msg: ChatMessageType;
  isMine: boolean;
  isPrevSameSender: boolean;
  isNextDifferentSender: boolean;
  currentNickname: string;
  currentProfileUrl: string;
  koreanTime: Date;
  shouldDisplayTime: boolean;
  isHighlighted: boolean;
  isCurrent: boolean;
  onProfileClick: (senderId: number) => void;
  messageRef: (el: HTMLDivElement | null) => void;
  messageType: string;
}

export const ChatMessage = ({
  msg,
  isMine,
  isPrevSameSender,
  isNextDifferentSender,
  currentNickname,
  currentProfileUrl,
  koreanTime,
  shouldDisplayTime,
  isHighlighted,
  isCurrent,
  onProfileClick,
  messageRef,
  messageType,
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

  // 챗봇의 자동 응답인 경우 (type: CHATBOT, chatbot: true)
  if (msg.type === "CHATBOT" && msg.chatbot) {
    return (
      <div ref={messageRef}>
        <div className="flex justify-start mb-1">
          <div className="flex flex-col items-start max-w-[70%]">
            <div className="flex items-center mb-1">
              <div className="w-8 mr-2">
                <img
                  src={chatBot}
                  alt="챗봇 프로필"
                  className="w-8 h-8 rounded-[2px] bg-white"
                />
              </div>
              <span className="text-base text-gray-700 font-GanwonEduAll_Light">
                만남배달부 봇
              </span>
            </div>
            <div className="flex items-end gap-1 ml-[40px]">
              <div className="px-3 py-2 rounded-xl whitespace-pre-wrap font-GanwonEduAll_Light bg-[#666] text-white rounded-bl-none">
                <span
                  className={`text-base ${
                    isHighlighted
                      ? isCurrent
                        ? "bg-[#EADCCB] text-[#333] font-bold"
                        : "bg-[#EADCCB] text-[#333]"
                      : ""
                  }`}
                >
                  {msg.message}
                </span>
              </div>
              {shouldDisplayTime && (
                <div className="flex flex-col gap-y-0.5 text-xs text-gray-400 leading-tight font-GanwonEduAll_Light items-start ml-1">
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
  }

  // 사용자의 챗봇 질문인 경우 (type: CHATBOT, chatbot: false)
  if (msg.type === "CHATBOT" && !msg.chatbot) {
    return (
      <div ref={messageRef}>
        <div className="flex justify-end mb-1">
          <div className="flex flex-col items-end max-w-[70%]">
            <div className="flex items-end gap-1">
              {shouldDisplayTime && (
                <div className="flex flex-col gap-y-0.5 text-xs text-gray-400 leading-tight font-GanwonEduAll_Light items-end mr-1">
                  <span className="whitespace-nowrap">
                    {koreanTime.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              )}
              <div className="px-3 py-2 rounded-xl whitespace-pre-wrap font-GanwonEduAll_Light bg-[#666] text-white rounded-br-none">
                <span
                  className={`text-base ${
                    isHighlighted
                      ? isCurrent
                        ? "bg-[#EADCCB] text-[#333] font-bold"
                        : "bg-[#EADCCB] text-[#333]"
                      : ""
                  }`}
                >
                  {msg.message}
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
    <div ref={messageRef}>
      <div className={`flex ${getMessageAlignment()} mb-1`}>
        {!isMine && !isPrevSameSender ? (
          <div
            className="w-8 mr-2 cursor-pointer"
            onClick={() => onProfileClick(msg.sender)}
          >
            <img
              src={getProfileImage()}
              alt="프로필"
              className="w-8 h-8 rounded-[2px] bg-white"
            />
          </div>
        ) : (
          !isMine && <div className="w-8 mr-2 " />
        )}

        <div className={`max-w-[70%] flex flex-col`}>
          {!isMine && !isPrevSameSender && (
            <span className="text-base text-gray-700 mb-1 font-GanwonEduAll_Light">
              {getDisplayName()}
            </span>
          )}
          <div
            className={`flex items-end gap-1 ${
              isMine ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl whitespace-pre-wrap font-GanwonEduAll_Light ${
                msg.imageUrl ? "" : getMessageStyle()
              }`}
            >
              {msg.imageUrl ? (
                <img
                  src={msg.imageUrl}
                  alt="전송된 이미지"
                  className="max-w-full max-h-[150px] rounded-lg"
                />
              ) : (
                <span
                  className={`text-base ${
                    isHighlighted
                      ? isCurrent
                        ? "bg-[#EADCCB] text-[#333] font-bold"
                        : "bg-[#EADCCB] text-[#333]"
                      : ""
                  }`}
                >
                  {msg.message}
                </span>
              )}
            </div>

            {shouldDisplayTime && (
              <div
                className={`flex flex-col gap-y-0.5 text-xs text-gray-400 leading-tight font-GanwonEduAll_Light ${
                  isMine ? "items-end mr-1" : "items-start ml-1"
                }`}
              >
                {isMine ? (
                  <>
                    {!msg.read && <span className="text-[#BD4B2C]">1</span>}
                    <span className="whitespace-nowrap">
                      {koreanTime.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="whitespace-nowrap">
                      {koreanTime.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    {!msg.read && <span className="text-[#BD4B2C]">1</span>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

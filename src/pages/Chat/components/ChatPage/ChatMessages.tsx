import React, { useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "./types";
import { ChatMessage } from "./ChatMessage";
import sampleProfile from "../../../../assets/img/sample/sample_profile.svg";
import chatBot from "../../../../assets/img/icons/Chat/chatBot.svg";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  myId: number | undefined;
  myNickname: string;
  otherNickname: string;
  userImgUrl: string | null;
  matchData: any;
  onProfileClick: (opponentId: number) => void;
  searchResults: number[];
  currentSearchIndex: number;
  searchQuery: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  myId,
  myNickname,
  otherNickname,
  userImgUrl,
  matchData,
  onProfileClick,
  searchResults,
  currentSearchIndex,
  searchQuery,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (searchResults.length > 0 && currentSearchIndex >= 0) {
      const targetIndex = searchResults[currentSearchIndex];
      messageRefs.current[targetIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, searchResults, currentSearchIndex]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "오늘";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제";
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div
      className="flex flex-col w-full overflow-y-auto p-4 z-0"
      style={{
        height: `calc(100% - 232px)`,
        transition: "height 0.3s ease",
      }}
    >
      {messages
        .filter(
          (msg) =>
            msg.visible ||
            (msg.sender === myId && (msg.chatbot || msg.type === "CHATBOT"))
        )
        .map((msg, index) => {
          const isChatbot = msg.type === "CHATBOT";
          const isMine = msg.sender === myId;
          let currentNickname = "나";
          let currentProfileUrl = sampleProfile;
          let messageType = "";

          if (isMine) {
            if (isChatbot) {
              messageType = "my-chatbot-question";
              currentNickname = myNickname;
              currentProfileUrl = userImgUrl || sampleProfile;
            } else if (msg.chatbot) {
              messageType = "chatbot-response-to-me";
              currentNickname = "만남배달부 봇";
              currentProfileUrl = chatBot;
            } else {
              messageType = "my-normal-message";
              currentNickname = myNickname;
              currentProfileUrl = userImgUrl || sampleProfile;
            }
          } else {
            if (isChatbot) {
              messageType = "opponent-chatbot-question";
              currentNickname = otherNickname;
              currentProfileUrl =
                myId === matchData?.user1Id
                  ? matchData?.user2ImageUrl || sampleProfile
                  : matchData?.user1ImageUrl || sampleProfile;
            } else if (msg.chatbot) {
              messageType = "chatbot-response-to-opponent";
              currentNickname = "만남배달부 봇";
              currentProfileUrl = chatBot;
            } else {
              messageType = "opponent-normal-message";
              currentNickname = otherNickname;
              currentProfileUrl =
                myId === matchData?.user1Id
                  ? matchData?.user2ImageUrl || sampleProfile
                  : matchData?.user1ImageUrl || sampleProfile;
            }
          }

          const isPrevSameSender =
            index > 0 &&
            messages[index - 1].sender === msg.sender &&
            messages[index - 1].type === msg.type &&
            messages[index - 1].chatbot === msg.chatbot;

          const messageDate = new Date(msg.sentAt);
          const koreanTime = new Date(messageDate.getTime());

          const showDateDivider =
            index === 0 ||
            new Date(messages[index - 1].sentAt).toDateString() !==
              messageDate.toDateString();

          let shouldDisplayTime = false;
          if (index === messages.length - 1) {
            shouldDisplayTime = true;
          } else {
            const nextMessage = messages[index + 1];
            const nextMessageDate = new Date(nextMessage.sentAt);
            const timeDifferenceInSeconds = Math.abs(
              (nextMessageDate.getTime() - messageDate.getTime()) / 1000
            );

            if (
              nextMessage.sender !== msg.sender ||
              nextMessage.type !== msg.type ||
              nextMessage.chatbot !== msg.chatbot ||
              timeDifferenceInSeconds > 60
            ) {
              shouldDisplayTime = true;
            }
          }

          const isHighlighted = searchResults.includes(index);
          const isCurrent =
            isHighlighted &&
            currentSearchIndex === searchResults.indexOf(index);

          return (
            <div key={`${msg.sentAt}-${index}`}>
              {showDateDivider && (
                <div className="flex justify-center items-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(koreanTime)}
                  </div>
                </div>
              )}
              <ChatMessage
                msg={msg}
                isMine={isMine}
                isPrevSameSender={isPrevSameSender}
                currentNickname={currentNickname}
                currentProfileUrl={currentProfileUrl}
                koreanTime={koreanTime}
                shouldDisplayTime={shouldDisplayTime}
                isHighlighted={isHighlighted}
                isCurrent={isCurrent}
                onProfileClick={onProfileClick}
                messageRef={(el) => {
                  messageRefs.current[index] = el;
                }}
                messageType={messageType}
                searchQuery={searchQuery}
              />
            </div>
          );
        })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;

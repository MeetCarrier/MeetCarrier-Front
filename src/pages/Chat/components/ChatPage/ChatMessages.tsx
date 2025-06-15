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
  emojiOpen: boolean;
  showSearchBar: boolean;
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
  emojiOpen,
  showSearchBar,
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

  const getDynamicHeight = () => {
    let baseHeight = 232; // ChatHeader (50px) + ChatBar (82px) + padding/margins

    if (showSearchBar) {
      baseHeight = 132; // ChatHeader (50px) + SearchBar in ChatBar (82px)
    } else if (emojiOpen) {
      baseHeight = 82 + 200; // ChatBar (82px) + Expanded Menu (200px)
    }
    // Notification bar height is approximately 60px if shown
    // Default: ChatHeader (50) + ChatNotificationHandler (approx 60) + ChatBar (82) = 192
    // Let's re-evaluate the fixed height based on the image.
    // The image shows notification bar takes up some space. If notification bar is not shown, message area should be taller.
    // The current height is `calc(100% - 232px)`. Let's assume 232px accounts for header, notification bar and chatbar
    // ChatHeader height is 50px.
    // ChatBar height is 82px.
    // If notification bar is shown, let's assume its height is about 60px (based on visual inspection and typical notification bar size).

    // So, total height to subtract when all are present = 50 (header) + 60 (notification) + 82 (chatbar) = 192px.
    // Original calc was 232px, so there's an extra 40px somewhere, maybe padding or margins.

    // Let's refine based on the given behavior:
    // When chatbar expands (emojiOpen), messages should shrink.
    // When search bar is open (showSearchBar), notification bar is hidden.

    // Default State (No Search, No Emoji Expansion, Notification Bar visible):
    // ChatHeader: 50px
    // Notification Bar: ~60px (Let's verify this from ChatNotificationBar.tsx)
    // ChatBar (input area): 82px
    // Total fixed elements at top/bottom: 50 + 60 + 82 = 192px. If we assume 232 is correct, then there's a 40px buffer.
    // Let's stick with 232px as base for now, representing header + notification + chat bar.
    let heightToSubtract = 232;

    if (showSearchBar) {
      // When search bar is open, notification bar is hidden, search results bar is 82px.
      // ChatHeader (50px) + ChatBar(search results) (82px) + ChatBar(input) (82px) = 214px.
      // Let's use 214px if search bar is active.
      heightToSubtract = 214;
    } else if (emojiOpen) {
      // When emoji is open, notification bar is visible, chat bar expands by 200px.
      // ChatHeader (50px) + Notification Bar (~60px) + ChatBar(input) (82px) + Emoji Menu (200px) = 392px.
      // If base was 232, then additional 200 for emoji = 432px (if 232 already includes notification bar)
      // Let's assume 232 includes notification bar as well as header and base chatbar.
      heightToSubtract = 232 + 200; // Original 232 + emoji menu 200
    }
    return `calc(100% - ${heightToSubtract}px)`;
  };

  return (
    <div
      className="flex flex-col w-full overflow-y-auto p-4 z-0"
      style={{
        height: getDynamicHeight(),
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
                  <div className="bg-gray-200 text-black text-xs px-3 py-1 rounded-full text-[15px] font-GanwonEduAll_Light">
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

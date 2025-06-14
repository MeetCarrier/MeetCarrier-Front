import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ChatBar from "./components/ChatBar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import sampleProfile from "../../assets/img/sample/sample_profile.svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Utils/store";
import { UserState } from "../../Utils/userSlice";
import { fetchUser } from "../../Utils/userSlice";
import ChatNotificationBar from "./components/ChatNotificationBar";
import MeetingInfoModal from "../../components/MeetingInfoModal";
import ProfileModal from "../../components/ProfileModal";
import { fetchUserById, UserProfileData } from "../../Utils/api";
import InviteLetterModal from "./Invite/InviteLetterModal";
import { ChatMessage } from "./components/ChatPage/ChatMessage";
import { ChatSearch } from "./components/ChatPage/ChatSearch";
import { ChatHeader } from "./components/ChatPage/ChatHeader";
import {
  ChatMessage as ChatMessageType,
  LocationState,
  MatchData,
  RoomInfo,
} from "./components/ChatPage/types";

import chatBot from "../../assets/img/icons/Chat/chatBot.svg";
import toast from "react-hot-toast";

interface ChatMessage {
  type: string;
  message: string;
  imageUrl: string | null;
  sender: number;
  sentAt: string;
  read: boolean;
  visible: boolean;
  chatbot: boolean;
}

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const state = location.state as LocationState;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;
  const myId = user?.userId;

  // Redux에서 만남 일정 정보 가져오기
  const meetingSchedule = useSelector(
    (state: RootState) => state.meetingSchedule
  );

  const [currentTime, setCurrentTime] = useState("");
  const [showMeetingInfoModal, setShowMeetingInfoModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(
    null
  );

  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [remainingChatTime, setRemainingChatTime] = useState<string | null>(
    null
  );
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(-1);

  // 알림으로부터 전달받은 초대장 모달 표시 여부
  const [showInviteModal, setShowInviteModal] = useState(
    state?.showInviteModal || false
  );

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}시 ${minutes}분 ${seconds}초`);
    };

    updateCurrentTime(); // 컴포넌트 마운트 시 한 번 실행
    const intervalId = setInterval(updateCurrentTime, 1000); // 1초마다 업데이트

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  const emojiHeight = emojiOpen ? 200 : 0;

  // 매치 데이터 가져오기
  useEffect(() => {
    const fetchMatchData = async () => {
      if (!state?.roomId) {
        console.error("방 정보가 없습니다.");
        navigate(-1);
        return;
      }

      try {
        const response = await axios.get(
          "https://www.mannamdeliveries.link/api/matches",
          { withCredentials: true }
        );
        const match = response.data.find(
          (m: MatchData) => m.roomId === state.roomId
        );

        if (!match) {
          console.error("매치 정보를 찾을 수 없습니다.");
          navigate(-1);
          return;
        }

        console.log("[매치 정보 조회 성공]", match);
        setMatchData(match);

        // 방 활성화 정보도 함께 조회
        const fetchRoomActivationInfo = async () => {
          try {
            const roomResponse = await axios.get(
              `https://www.mannamdeliveries.link/api/room/${state.roomId}`,
              { withCredentials: true }
            );
            setRoomInfo(roomResponse.data);
            console.log("[방 활성화 정보 조회 성공]", roomResponse.data);
          } catch (error) {
            console.error("방 활성화 정보 조회 실패:", error);
          }
        };
        fetchRoomActivationInfo();
      } catch (error) {
        console.error("매치 데이터 조회 실패:", error);
        navigate(-1);
      }
    };

    fetchMatchData();
  }, [state?.roomId, navigate]);

  // 채팅방 활성화 시간 카운트다운
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (
      roomInfo &&
      roomInfo.status === "Activate" &&
      roomInfo.deactivationTime
    ) {
      const calculateRemaining = () => {
        const now = new Date();
        const deactivationDate = new Date(roomInfo.deactivationTime);
        const diff = deactivationDate.getTime() - now.getTime();

        if (diff <= 0) {
          setRemainingChatTime("00분 00초");
          setRoomInfo((prev) =>
            prev ? { ...prev, status: "Deactivate" } : null
          );
          if (timer) clearInterval(timer);
        } else {
          const totalSeconds = Math.floor(diff / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          let formattedTime = "";
          if (hours > 0) {
            formattedTime += `${String(hours).padStart(2, "0")}시간 `;
          }
          formattedTime += `${String(minutes).padStart(2, "0")}분 ${String(
            seconds
          ).padStart(2, "0")}초`;
          setRemainingChatTime(formattedTime);
        }
      };

      calculateRemaining();
      timer = setInterval(calculateRemaining, 1000);
    } else if (roomInfo && roomInfo.status === "Deactivate") {
      setRemainingChatTime("00분 00초");
    } else {
      setRemainingChatTime(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [roomInfo]);

  useEffect(() => {
    // 사용자 정보 가져오기
    dispatch(fetchUser());

    if (!state?.roomId || !matchData) {
      return;
    }

    // location.state 내용 출력
    console.log("[채팅방 진입] location.state:", {
      roomId: state.roomId,
      matchData: matchData,
    });

    // 채팅 기록 조회
    const fetchChatHistory = async () => {
      try {
        console.log("채팅 기록 조회 시작:", state.roomId);
        const response = await axios.get(
          `https://www.mannamdeliveries.link/api/chat/${state.roomId}`,
          { withCredentials: true }
        );
        console.log("채팅 기록 조회 결과:", response.data);

        // UTC 시간을 한국 시간으로 변환
        const convertedMessages = response.data.map((msg: ChatMessage) => ({
          ...msg,
          sentAt: new Date(msg.sentAt).toISOString(),
        }));

        setMessages(convertedMessages);
      } catch (error) {
        console.error("채팅 기록 조회 실패:", error);
      }
    };

    // WebSocket 연결 설정
    console.log("WebSocket 연결 시작");
    const socket = new SockJS(
      "https://www.mannamdeliveries.link/api/connection"
    );
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket 연결 성공");
        // 채팅방 메시지 구독
        stompClient.subscribe(`/topic/room/${state.roomId}`, (message) => {
          console.log("[수신된 메시지]", message);
          const newMessage: ChatMessage = JSON.parse(message.body);
          console.log("[파싱된 메시지]", newMessage);

          // 내 메시지는 이미 로컬에서 띄웠으므로 무시
          if (
            Number(newMessage.sender) === Number(myId) &&
            !newMessage.chatbot
          ) {
            console.log("[무시된 내 메시지]", newMessage);
            return;
          }

          // 챗봇 메시지인 경우 chatbot 속성을 true로 설정
          if (newMessage.type === "CHATBOT") {
            newMessage.chatbot = true;
          }

          setMessages((prev) => [...prev, newMessage]);
        });

        // 읽음 확인 구독
        stompClient.subscribe(`/topic/room/${state.roomId}/read`, (message) => {
          console.log("[읽음 확인 수신]", message);
          const readerId = JSON.parse(message.body);

          // 내가 보낸 메시지들의 읽음 상태 업데이트
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === myId ? { ...msg, read: true } : msg
            )
          );
        });
      },
      onDisconnect: () => {
        console.log("WebSocket 연결 해제");
      },
      onStompError: (frame) => {
        console.error("STOMP 에러 발생:", frame);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket 에러 발생:", event);
      },
      debug: function (str) {
        console.log("STOMP Debug:", str);
      },
    });

    stompClientRef.current = stompClient;
    stompClient.activate();

    fetchChatHistory();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      console.log("컴포넌트 언마운트 - WebSocket 연결 해제");
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [state?.roomId, navigate, dispatch, myId, matchData]);

  // 메시지 전송 함수
  const sendMessage = (message: string, imageUrl?: string) => {
    if (!myId) {
      console.error("사용자 ID가 없습니다.");
      toast.error("사용자 ID가 없습니다.");
      return;
    }

    if (roomInfo?.status === "Deactivate" && matchData?.status !== "Meeting") {
      toast.error("채팅이 비활성화되어 메시지를 보낼 수 없습니다.");
      return;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      console.log("[WebSocket 연결 상태]", stompClientRef.current.connected);

      // 서버에 보낼 메시지 (규격 준수)
      const outgoingMessage = {
        roomId: state.roomId,
        type: imageUrl ? "IMAGE" : "TEXT",
        message: message,
        imageUrl: imageUrl || null,
      };

      // 로컬에서 바로 화면에 띄울 메시지
      const now = new Date();
      const utcSentAt = new Date(now.getTime()).toISOString();
      const localMessage: ChatMessage = {
        type: imageUrl ? "IMAGE" : "TEXT",
        message: message,
        imageUrl: imageUrl || null,
        sender: Number(myId),
        sentAt: utcSentAt,
        read: false,
        visible: true,
        chatbot: false,
      };

      try {
        // 서버에 전송
        stompClientRef.current.publish({
          destination: "/app/api/chat/send",
          body: JSON.stringify(outgoingMessage),
          headers: {
            "content-type": "application/json",
          },
        });
        console.log("[메시지 전송 성공]");
        setMessages((prev) => [...prev, localMessage]);
      } catch (error) {
        console.error("[메시지 전송 실패]", error);
      }
    } else {
      console.warn(
        "[WebSocket 연결 없음] 연결 상태:",
        stompClientRef.current?.connected
      );
    }
  };

  // 챗봇 메시지 처리 함수
  const handleBotQuestion = (question: string) => {
    if (!myId) {
      console.error("사용자 ID가 없습니다. 챗봇 질문을 처리할 수 없습니다.");
      return;
    }

    const now = new Date();
    const utcSentAt = new Date(now.getTime()).toISOString();
    const botQuestionMessage: ChatMessage = {
      type: "CHATBOT",
      message: question,
      imageUrl: null,
      sender: Number(myId),
      sentAt: utcSentAt,
      read: true,
      visible: true,
      chatbot: false, // 사용자의 챗봇 질문은 chatbot: false
    };
    setMessages((prev) => [...prev, botQuestionMessage]);
  };

  // 채팅방 퇴장 함수
  const handleLeave = () => {
    navigate("/ChatList");
  };

  const handleBackClick = () => {
    handleLeave();
  };

  // 스크롤을 항상 최신 메시지로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 날짜 포맷팅 함수 추가
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

  // userId로 내 정보/상대 정보 구분
  let myNickname = "나";
  let otherNickname = "상대방";
  if (matchData) {
    if (user?.userId === matchData.user1Id) {
      myNickname = matchData.user1Nickname ?? "";
      otherNickname = matchData.user2Nickname ?? "";
    } else if (user?.userId === matchData.user2Id) {
      myNickname = matchData.user2Nickname ?? "";
      otherNickname = matchData.user1Nickname ?? "";
    }
  }

  const handleProfileClick = async (opponentId: number) => {
    if (!opponentId) return;
    try {
      const userData = await fetchUserById(opponentId);
      setSelectedUser({
        ...userData,
        imageUrl: userData.imgUrl || userData.imageUrl || null,
      });
      setShowProfileModal(true);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    }
  };

  // 검색 기능
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const newSearchResults: number[] = [];
    // 메시지를 역순으로 탐색하여 최신 메시지부터 검색합니다.
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.message.toLowerCase().includes(lowerCaseQuery)) {
        newSearchResults.push(i);
      }
    }

    setSearchResults(newSearchResults);
    if (newSearchResults.length > 0) {
      setCurrentSearchIndex(0); // 맨 아래(최신) 결과부터 시작
      // 첫 번째 검색 결과로 스크롤 (맨 아래 결과)
      const firstResultIndex = newSearchResults[0];
      if (messageRefs.current[firstResultIndex]) {
        messageRefs.current[firstResultIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      setCurrentSearchIndex(-1);
    }
  };

  // 검색 결과 이동
  const navigateSearchResults = (direction: "prev" | "next") => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex;
    if (direction === "next") {
      // ▲ (위로 이동, 더 오래된 메시지)
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      // ▼ (아래로 이동, 더 최신 메시지)
      newIndex =
        (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    }
    setCurrentSearchIndex(newIndex);

    // 새 검색 결과로 스크롤
    const targetMessageIndex = searchResults[newIndex];
    if (messageRefs.current[targetMessageIndex]) {
      messageRefs.current[targetMessageIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // 컴포넌트 마운트 시 초대장 모달 표시
  useEffect(() => {
    if (state?.showInviteModal) {
      setShowInviteModal(true);
    }
  }, [state?.showInviteModal]);

  return (
    <>
      {!showSearchBar ? (
        <ChatHeader
          otherNickname={otherNickname}
          onBackClick={handleBackClick}
          onSearchClick={() => setShowSearchBar(true)}
        />
      ) : (
        <ChatSearch
          showSearchBar={showSearchBar}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          onClose={() => {
            setShowSearchBar(false);
            setSearchQuery("");
            setSearchResults([]);
            setCurrentSearchIndex(-1);
          }}
        />
      )}

      <ChatBar
        emojiOpen={emojiOpen}
        onEmojiToggle={() => setEmojiOpen((prev) => !prev)}
        onSendMessage={sendMessage}
        senderName={myNickname}
        recipientName={otherNickname}
        senderProfile={user?.imgUrl || sampleProfile}
        matchId={matchData?.id || 0}
        receiverId={
          user?.userId === matchData?.user1Id
            ? matchData?.user2Id ?? 0
            : matchData?.user1Id ?? 0
        }
        roomId={state.roomId}
        onInviteClick={() => {
          if (
            roomInfo?.status === "Deactivate" &&
            matchData?.status !== "Meeting"
          ) {
            toast.error("비활성화된 채팅방에서는 초대할 수 없습니다.");
            return;
          }
          navigate("/invite-write", {
            state: {
              senderName: myNickname,
              recipientName: otherNickname,
              senderProfile: user?.imgUrl || sampleProfile,
              matchId: matchData?.id || 0,
              receiverId:
                user?.userId === matchData?.user1Id
                  ? matchData?.user2Id ?? 0
                  : matchData?.user1Id ?? 0,
              roomId: state.roomId,
              myId: user?.userId,
            },
          });
        }}
        onSurveyClick={() => {
          navigate(`/survey/${matchData?.sessionId}`, {
            state: {
              sessionId: matchData?.sessionId,
            },
          });
        }}
        onEndMeeting={() => {
          if (
            roomInfo?.status === "Deactivate" &&
            matchData?.status !== "Meeting"
          ) {
            toast.error("이미 비활성화된 채팅방입니다.");
            return;
          }
          navigate("/ChatList");
        }}
        stompClient={stompClientRef.current}
        isRoomActive={
          roomInfo?.status === "Activate" || matchData?.status === "Meeting"
        }
        isSearchMode={showSearchBar}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
        onNavigateSearchResults={navigateSearchResults}
        searchQuery={searchQuery}
        onBotMessage={handleBotQuestion}
        myId={myId}
      />

      {!showSearchBar && (
        <ChatNotificationBar
          type={meetingSchedule.isScheduled ? "schedule" : "time"}
          time={remainingChatTime || currentTime}
          scheduleDate={
            meetingSchedule.isScheduled
              ? `${meetingSchedule.date?.split("-")[1]}월 ${
                  meetingSchedule.date?.split("-")[2]
                }일 ${new Date(meetingSchedule.date || "").toLocaleDateString(
                  "ko-KR",
                  { weekday: "short" }
                )}요일`
              : undefined
          }
          location={meetingSchedule.location || undefined}
          memo={meetingSchedule.memo || undefined}
          isScheduled={meetingSchedule.isScheduled}
          onModifyClick={() => setShowMeetingInfoModal(true)}
          isRoomActive={
            roomInfo?.status === "Activate" || matchData?.status === "Meeting"
          }
        />
      )}

      <div
        className="flex flex-col w-full overflow-y-auto p-4 z-0"
        style={{
          height: showSearchBar
            ? `calc(100% - 180px)`
            : `calc(100% - ${emojiOpen ? 432 : 232}px)`,
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
            let currentOpponentNickname = "상대방";
            let currentProfileUrl = sampleProfile;
            let messageType = "";

            // 메시지 유형 결정
            if (isMine) {
              if (isChatbot) {
                messageType = "my-chatbot-question";
                currentNickname = myNickname;
                currentProfileUrl = user?.imgUrl || sampleProfile;
              } else if (msg.chatbot) {
                messageType = "chatbot-response-to-me";
                currentNickname = "만남배달부 봇";
                currentProfileUrl = chatBot;
              } else {
                messageType = "my-normal-message";
                currentNickname = myNickname;
                currentProfileUrl = user?.imgUrl || sampleProfile;
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
            const isNextDifferentSender =
              index === messages.length - 1 ||
              messages[index + 1].sender !== msg.sender ||
              messages[index + 1].type !== msg.type ||
              messages[index + 1].chatbot !== msg.chatbot;

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
                  isNextDifferentSender={isNextDifferentSender}
                  currentNickname={currentNickname}
                  currentProfileUrl={currentProfileUrl}
                  koreanTime={koreanTime}
                  shouldDisplayTime={shouldDisplayTime}
                  isHighlighted={isHighlighted}
                  isCurrent={isCurrent}
                  onProfileClick={handleProfileClick}
                  messageRef={(el) => {
                    messageRefs.current[index] = el;
                  }}
                  messageType={messageType}
                />
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      <MeetingInfoModal
        isOpen={showMeetingInfoModal}
        onClose={() => setShowMeetingInfoModal(false)}
        onConfirm={() => setShowMeetingInfoModal(false)}
      />

      {showProfileModal && selectedUser && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={selectedUser}
        />
      )}

      <InviteLetterModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        senderName={myNickname}
        recipientName={otherNickname}
        senderProfile={user?.imgUrl || sampleProfile}
        matchId={matchData?.id || 0}
        receiverId={
          user?.userId === matchData?.user1Id
            ? matchData?.user2Id ?? 0
            : matchData?.user1Id ?? 0
        }
        roomId={state.roomId}
        myId={myId}
      />
    </>
  );
}

export default ChatPage;

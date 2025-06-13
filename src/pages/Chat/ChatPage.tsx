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

import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import search_icon from "../../assets/img/icons/ChatIcon/search.svg";

interface ChatMessage {
  messageType: string;
  message: string;
  imageUrl: string | null;
  sender: number;
  sentAt: string;
}

interface LocationState {
  roomId: number;
}

interface MatchData {
  id: number;
  user1Id: number;
  user1Nickname: string;
  user1ImageUrl?: string; // 추가
  user2Id: number;
  user2Nickname: string;
  user2ImageUrl?: string; // 추가
  agreed: boolean;
  matchedAt?: string;
  status: string;
  sessionId: number;
  roomId: number;
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
      } catch (error) {
        console.error("매치 데이터 조회 실패:", error);
        navigate(-1);
      }
    };

    fetchMatchData();
  }, [state?.roomId, navigate]);

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
        const convertedMessages = response.data.map((msg: ChatMessage) => {
          const utcDate = new Date(msg.sentAt);
          // UTC 시간을 그대로 사용 (서버에서 이미 UTC로 보내주므로 추가 변환 불필요)
          return {
            ...msg,
            sentAt: utcDate.toISOString(),
          };
        });

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
        // 채팅방 구독
        stompClient.subscribe(`/topic/room/${state.roomId}`, (message) => {
          console.log("[수신된 메시지]", message);
          const newMessage: ChatMessage = JSON.parse(message.body);
          console.log("[파싱된 메시지]", newMessage);
          console.log("[현재 사용자 ID]", myId, "타입:", typeof myId);
          console.log(
            "[메시지 발신자 ID]",
            newMessage.sender,
            "타입:",
            typeof newMessage.sender
          );

          // 내 메시지는 이미 로컬에서 띄웠으므로 무시
          if (Number(newMessage.sender) === Number(myId)) {
            console.log("[무시된 내 메시지]", newMessage);
            return;
          }

          setMessages((prev) => [...prev, newMessage]);
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

      // 로컬에서 바로 화면에 띄울 메시지 (내가 보낸 것이므로 sender와 sentAt 명시)
      const now = new Date();
      // 현재 시간을 UTC로 변환 (한국 시간에서 9시간을 빼서 UTC로 만듦)
      const utcSentAt = new Date(now.getTime()).toISOString();
      const localMessage: ChatMessage = {
        messageType: imageUrl ? "IMAGE" : "TEXT",
        message: message,
        imageUrl: imageUrl || null,
        sender: Number(myId),
        sentAt: utcSentAt,
      };

      // 1. 화면에 즉시 표시
      console.log("[보낼 메시지]", {
        headers: {
          destination: "/app/api/chat/send",
          contentType: "application/json",
        },
        body: outgoingMessage,
      });

      try {
        // 2. 서버에 전송
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
      myNickname = matchData.user1Nickname;
      otherNickname = matchData.user2Nickname;
    } else if (user?.userId === matchData.user2Id) {
      myNickname = matchData.user2Nickname;
      otherNickname = matchData.user1Nickname;
    }
  }

  const handleProfileClick = async (opponentId: number) => {
    if (!opponentId) return;
    try {
      const userData = await fetchUserById(opponentId);
      setSelectedUser(userData);
      setShowProfileModal(true);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    }
  };

  return (
    <>
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">
          {otherNickname}
        </p>
        <img
          src={search_icon}
          alt="search_icon"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
        />
      </div>
      {/* 하단 입력창 */}
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
            ? matchData?.user2Id
            : matchData?.user1Id || 0
        }
        roomId={state.roomId}
        onInviteClick={() => {
          if (matchData?.status === "Chat_Cancelled") {
            alert("종료된 채팅방에서는 초대할 수 없습니다.");
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
                  ? matchData?.user2Id
                  : matchData?.user1Id || 0,
              roomId: state.roomId,
            },
          });
        }}
        onSurveyClick={() => {
          if (matchData?.status === "Chat_Cancelled") {
            alert("종료된 채팅방에서는 설문을 볼 수 없습니다.");
            return;
          }
          navigate(`/survey/${matchData?.sessionId}`, {
            state: {
              sessionId: matchData?.sessionId,
            },
          });
        }}
        onEndMeeting={() => {
          if (matchData?.status === "Chat_Cancelled") {
            alert("이미 종료된 채팅방입니다.");
            return;
          }
          navigate("/ChatList");
        }}
        stompClient={stompClientRef.current}
        isDisabled={matchData?.status === "Chat_Cancelled"}
      />

      {/* 알림 바 */}
      <ChatNotificationBar
        type={meetingSchedule.isScheduled ? "schedule" : "time"}
        time={currentTime}
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
      />

      <div
        className="flex flex-col w-full overflow-y-auto p-4 z-0"
        style={{
          height: `calc(100% - 240px - ${emojiHeight}px)`,
          transition: "height 0.3s ease",
        }}
      >
        {messages.map((msg, index) => {
          const isMine = msg.sender === myId;
          // myId로 내 정보/상대 정보 구분
          let myNickname = "나";
          let opponentNickname = "상대방";
          if (myId === matchData?.user1Id) {
            myNickname = matchData.user1Nickname;
            opponentNickname = matchData.user2Nickname;
          } else if (myId === matchData?.user2Id) {
            myNickname = matchData.user2Nickname;
            opponentNickname = matchData.user1Nickname;
          }
          const nickname = isMine ? myNickname : opponentNickname;
          const isPrevSameSender =
            index > 0 && messages[index - 1].sender === msg.sender;
          const isNextDifferentSender =
            index === messages.length - 1 ||
            messages[index + 1].sender !== msg.sender;

          const profileUrl = !isMine
            ? myId === matchData?.user1Id
              ? matchData?.user2ImageUrl || sampleProfile
              : matchData?.user1ImageUrl || sampleProfile
            : user?.imgUrl || sampleProfile;

          // UTC 시간을 한국 시간으로 변환
          const messageDate = new Date(msg.sentAt);
          const koreanTime = new Date(messageDate.getTime());

          // 날짜 구분선 표시 여부 확인
          const showDateDivider =
            index === 0 ||
            new Date(messages[index - 1].sentAt).toDateString() !==
              messageDate.toDateString();

          return (
            <div key={`${msg.sentAt}-${index}`}>
              {showDateDivider && (
                <div className="flex justify-center items-center my-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(koreanTime)}
                  </div>
                </div>
              )}
              <div
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                } mb-1`}
              >
                {/* 왼쪽 프로필 (처음 메시지일 때만) */}
                {!isMine && !isPrevSameSender ? (
                  <div
                    className="w-8 mr-2 cursor-pointer"
                    onClick={() => handleProfileClick(msg.sender)}
                  >
                    <img
                      src={profileUrl}
                      alt="프로필"
                      className="w-8 h-8 rounded-[2px] bg-white"
                    />
                  </div>
                ) : (
                  !isMine && <div className="w-8 mr-2 " />
                )}

                {/* 채팅 div */}
                <div className={`max-w-[70%] flex flex-col`}>
                  {/* 닉네임은 첫 메시지일 때만 */}
                  {!isMine && !isPrevSameSender && (
                    <span className="text-sm text-gray-700 mb-1">
                      {nickname}
                    </span>
                  )}

                  <div
                    className={`px-3 py-2 rounded-xl whitespace-pre-wrap ${
                      msg.imageUrl
                        ? ""
                        : isMine
                        ? "bg-[#BD4B2C] text-[#F2F2F2] rounded-br-none self-end"
                        : "bg-[#FFFFFF] text-[#333333] rounded-bl-none"
                    }`}
                  >
                    {msg.imageUrl ? (
                      <img
                        src={msg.imageUrl}
                        alt="전송된 이미지"
                        className="max-w-full max-h-[150px] rounded-lg"
                      />
                    ) : (
                      msg.message
                    )}
                  </div>

                  {isNextDifferentSender && (
                    <span
                      className={`text-xs text-gray-400 mt-1 ${
                        isMine ? "text-right pr-1" : "text-left pl-1"
                      }`}
                    >
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
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* 만남 일정 정보 모달 */}
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
    </>
  );
}

export default ChatPage;

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
import ChatGuideModal from "./components/ChatPage/ChatGuideModal";
import ChatMessages from "./components/ChatPage/ChatMessages";
import ChatNotificationHandler from "./components/ChatPage/ChatNotificationHandler";

import {
  LocationState,
  MatchData,
  RoomInfo,
} from "./components/ChatPage/types";

import toast from "react-hot-toast";
import { NotificationType } from "./components/ChatNotificationBar";

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
  const [opponentInRoom, setOpponentInRoom] = useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(-1);
  const [showChatGuide, setShowChatGuide] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(
    state?.showInviteModal || false
  );
  const [notificationType, setNotificationType] =
    useState<NotificationType>("NO_INVITATION");
  const [meetingDate, setMeetingDate] = useState<Date | undefined>();
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [meetingId, setMeetingId] = useState<number | null>(null);
  const [loadingInvitation, setLoadingInvitation] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState<{
    exists: boolean;
    isSender: boolean;
    isReceiver: boolean;
  } | null>(null);

  useEffect(() => {
    const shouldHide = localStorage.getItem("hideChatGuideModal") === "true";
    if (!shouldHide) {
      setShowChatGuide(true);
    }
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}시 ${minutes}분 ${seconds}초`);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

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

  // 초대장 정보 가져오기
  useEffect(() => {
    const fetchInvitationStatus = async () => {
      if (!matchData?.id || !myId) {
        setNotificationType("NO_INVITATION");
        return;
      }

      try {
        const response = await axios.get(`/api/invitation/${matchData.id}`);
        const invitation = response.data;

        if (invitation.status === "PENDING") {
          setNotificationType("PENDING");
        } else if (invitation.status === "ACCEPTED") {
          try {
            const meetingResponse = await axios.get(
              `/api/meetings/${matchData.id}`
            );
            setMeetingDate(new Date(meetingResponse.data.date));
            setMeetingId(meetingResponse.data.id);
            setNotificationType("SCHEDULED");
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              setNotificationType("NEED_SCHEDULE");
            }
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setNotificationType("NO_INVITATION");
        }
      }
    };

    fetchInvitationStatus();
  }, [matchData?.id, myId]);

  // 채팅방 활성화 시간 업데이트
  useEffect(() => {
    const updateRemainingTime = () => {
      if (roomInfo?.deactivationTime) {
        const now = new Date();
        const deactivation = new Date(roomInfo.deactivationTime);
        const diff = deactivation.getTime() - now.getTime();

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setRemainingTime(`${hours}시간 ${minutes}분 ${seconds}초`);
        } else {
          setRemainingTime("00시간 00분 00초");
        }
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [roomInfo?.deactivationTime]);

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

          // 내가 보낸 메시지 무시 로직을 완전히 제거하고,
          // 서버로부터 수신된 모든 메시지를 그대로 추가합니다.

          // 챗봇 메시지인 경우 chatbot 속성을 true로 설정
          if (newMessage.type === "CHATBOT") {
            newMessage.chatbot = true;
          }

          setMessages((prev) => [...prev, newMessage]);
        });

        // 읽음 확인 구독
        stompClient.subscribe(`/topic/room/${state.roomId}/read`, (message) => {
          console.log("[읽음 확인 수신]", message);
          setOpponentInRoom(true); // ✅ 상대방이 이 방에 있다는 증거
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
        <ChatNotificationHandler
          matchData={matchData}
          myId={myId}
          myNickname={myNickname}
          otherNickname={otherNickname}
          isSender={user?.userId === matchData?.user1Id}
          roomInfo={roomInfo}
        />
      )}

      <ChatMessages
        messages={messages}
        myId={myId}
        myNickname={myNickname}
        otherNickname={otherNickname}
        userImgUrl={user?.imgUrl}
        matchData={matchData}
        onProfileClick={handleProfileClick}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
      />

      <MeetingInfoModal
        isOpen={showMeetingInfoModal}
        onClose={() => setShowMeetingInfoModal(false)}
        onConfirm={() => setShowMeetingInfoModal(false)}
        matchId={matchData?.id}
        myId={myId}
        roomId={state.roomId}
        senderName={myNickname}
        recipientName={otherNickname}
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
        invitationStatus={invitationStatus}
        loadingInvitation={loadingInvitation}
      />
      <ChatGuideModal
        isOpen={showChatGuide}
        onClose={() => setShowChatGuide(false)}
      />
    </>
  );
}

export default ChatPage;

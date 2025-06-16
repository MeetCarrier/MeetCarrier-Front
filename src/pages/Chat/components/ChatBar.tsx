import navbg from "../../../assets/img/nav_bg.webp";
import navbg2 from "../../../assets/img/nav_bg2.webp";
import { useState, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import toast from "react-hot-toast";

import ReportModal from "../../../components/ReportModal";
import EndModal from "../../../components/EndModal";

import plus_icon from "../../../assets/img/icons/ChatIcon/ic_plus.svg";
import arrow_icon from "../../../assets/img/icons/ChatIcon/ic_arrow.svg";
import face_icon from "../../../assets/img/icons/ChatIcon/ic_face.svg";
import questionmark_icon from "../../../assets/img/icons/ChatIcon/ic_questionmark.svg";
import album_icon from "../../../assets/img/icons/ChatIcon/ic_album.svg";
import invite_icon from "../../../assets/img/icons/ChatIcon/ic_invite.svg";
import end_icon from "../../../assets/img/icons/ChatIcon/ic_end.svg";
import report_icon from "../../../assets/img/icons/ChatIcon/ic_report.svg";
import survey_icon from "../../../assets/img/icons/ChatIcon/ic_survey.svg";
import imageCompression from "browser-image-compression";
import secretaryIcon from "../../../assets/img/icons/Chat/secretary.svg";

import SecretaryModal from "./ChatPage/SecretaryModal";

// 이모티콘 이미지 임포트
import emoji1 from "../../../assets/img/icons/Chat/1.svg";
import emoji2 from "../../../assets/img/icons/Chat/2.svg";
import emoji3 from "../../../assets/img/icons/Chat/3.svg";
import emoji4 from "../../../assets/img/icons/Chat/4.svg";
import emoji5 from "../../../assets/img/icons/Chat/5.svg";
import emoji6 from "../../../assets/img/icons/Chat/6.svg";
import emoji7 from "../../../assets/img/icons/Chat/7.svg";
import emoji8 from "../../../assets/img/icons/Chat/8.svg";
import emoji9 from "../../../assets/img/icons/Chat/9.svg";
import emoji10 from "../../../assets/img/icons/Chat/10.svg";
import emoji11 from "../../../assets/img/icons/Chat/11.svg";
import emoji12 from "../../../assets/img/icons/Chat/12.svg";
import emoji13 from "../../../assets/img/icons/Chat/13.svg";
import emoji14 from "../../../assets/img/icons/Chat/14.svg";
import emoji15 from "../../../assets/img/icons/Chat/15.svg";

interface ChatBarProps {
  emojiOpen: boolean;
  onEmojiToggle: () => void;
  onSendMessage: (message: string, imageUrl?: string) => void;
  senderName: string;
  recipientName: string;
  senderProfile: string;
  matchId: number;
  receiverId: number;
  roomId: number;
  onInviteClick: () => void;
  onSurveyClick: () => void;
  onEndMeeting: () => void;
  stompClient: Client | null;
  isRoomActive: boolean;
  isSearchMode: boolean;
  searchResults: number[];
  currentSearchIndex: number;
  onNavigateSearchResults: (direction: "prev" | "next") => void;
  searchQuery: string;
  myId: number | undefined;
}

function ChatBar({
  onEmojiToggle,
  emojiOpen,
  onSendMessage,
  receiverId,
  roomId,
  onInviteClick,
  onSurveyClick,
  onEndMeeting,
  stompClient: existingStompClient,
  isRoomActive,
  isSearchMode,
  searchResults,
  currentSearchIndex,
  onNavigateSearchResults,
  searchQuery,
  myId,
}: ChatBarProps) {
  const [message, setMessage] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isBotMode, setIsBotMode] = useState(false);
  const [botInput, setBotInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentMenuType, setCurrentMenuType] = useState<"general" | "emoji">(
    "general"
  );
  const [selectedEmojiUrl, setSelectedEmojiUrl] = useState<string | null>(null);
  const [isVisibleToOpponent, setIsVisibleToOpponent] = useState(false);
  const [isSecretaryMode, setIsSecretaryMode] = useState(false);
  const [secretaryInput, setSecretaryInput] = useState("");
  const [secretaryMessages, setSecretaryMessages] = useState<
    { sender: "bot" | "user"; text: string; createdAt: Date }[]
  >([]);
  const secretarySubscriptionRef = useRef<any>(null);
  const [lastQuestionTime, setLastQuestionTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const [botLastQuestionTime, setBotLastQuestionTime] = useState<Date | null>(
    null
  );
  const [botRemainingTime, setBotRemainingTime] = useState<number>(0);

  const emojis = [
    emoji1,
    emoji2,
    emoji3,
    emoji4,
    emoji5,
    emoji6,
    emoji7,
    emoji8,
    emoji9,
    emoji10,
    emoji11,
    emoji12,
    emoji13,
    emoji14,
    emoji15,
  ];

  const fetchSecretaryHistory = async () => {
    try {
      console.log("[비서봇] 대화 내역 조회 시작");
      const response = await axios.get(
        "https://www.mannamdeliveries.link/api/assistant",
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        console.log("[비서봇] 대화 내역 조회 성공:", response.data);
        const { assistantQuestions, assistantAnswers } = response.data;

        const allMessages = [
          ...assistantQuestions.map((q: any) => ({
            sender: "user" as const,
            text: q.content,
            createdAt: new Date(q.createdAt),
          })),
          ...assistantAnswers.map((a: any) => ({
            sender: "bot" as const,
            text: a.content,
            createdAt: new Date(a.createdAt),
          })),
        ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        console.log("[비서봇] 정렬된 메시지:", allMessages);
        setSecretaryMessages(allMessages);
      }
    } catch (error) {
      console.error("[비서봇] 대화 내역 조회 실패:", error);
      toast.error("대화 내역을 불러오는데 실패했습니다.");
    }
  };

  const subscribeToSecretary = () => {
    if (existingStompClient?.connected && myId) {
      console.log("[비서봇] 구독 시작", {
        topic: `/topic/assistant/${myId}`,
        myId,
        isConnected: existingStompClient.connected,
      });

      secretarySubscriptionRef.current = existingStompClient.subscribe(
        `/topic/assistant/${myId}`,
        (message) => {
          console.log("[비서봇] 메시지 수신:", {
            rawMessage: message,
            body: message.body,
            headers: message.headers,
          });

          try {
            const data = JSON.parse(message.body);
            console.log("[비서봇] 파싱된 응답:", {
              content: data.content,
              createdAt: data.createdAt,
              fullData: data,
            });

            setSecretaryMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: data.content,
                createdAt: new Date(data.createdAt),
              },
            ]);
          } catch (error) {
            console.error("[비서봇] 메시지 파싱 에러:", error);
          }
        }
      );
    } else {
      console.error("[비서봇] 구독 실패:", {
        isConnected: existingStompClient?.connected,
        myId,
      });
    }
  };

  const unsubscribeFromSecretary = () => {
    if (secretarySubscriptionRef.current) {
      console.log("[비서봇] 구독 해제");
      secretarySubscriptionRef.current.unsubscribe();
      secretarySubscriptionRef.current = null;
    }
  };

  useEffect(() => {
    if (isSecretaryMode) {
      subscribeToSecretary();
    } else {
      unsubscribeFromSecretary();
    }

    return () => {
      unsubscribeFromSecretary();
    };
  }, [isSecretaryMode, existingStompClient, myId]);

  // 남은 시간 계산 및 표시 업데이트
  useEffect(() => {
    if (!lastQuestionTime) {
      setRemainingTime(0);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const timeDiff = Math.max(
        0,
        15 - Math.floor((now.getTime() - lastQuestionTime.getTime()) / 1000)
      );
      setRemainingTime(timeDiff);

      if (timeDiff === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastQuestionTime]);

  useEffect(() => {
    if (!botLastQuestionTime) {
      setBotRemainingTime(0);
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const timeDiff = Math.max(
        0,
        15 - Math.floor((now.getTime() - botLastQuestionTime.getTime()) / 1000)
      );
      setBotRemainingTime(timeDiff);

      if (timeDiff === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [botLastQuestionTime]);

  const handleSendMessage = () => {
    if (!isRoomActive) {
      toast.error("비활성화된 채팅방에서는 메시지를 보낼 수 없습니다.");
      return;
    }
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const uploadImageAndSendMessage = async (file: File) => {
    const formData = new FormData();
    formData.append("multipartFile", file);

    try {
      console.log("이미지 서버 업로드 시작");
      const response = await axios.post(
        "https://www.mannamdeliveries.link/api/file/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("이미지 서버 업로드 성공:", response.data);
      const imageUrl = response.data;

      if (onSendMessage) {
        onSendMessage("이미지를 전송했습니다.", imageUrl);
      }
    } catch (error) {
      console.error("이미지 서버 업로드 실패:", error);
      if (axios.isAxiosError(error)) {
        console.error("서버 응답 내용:", error.response?.data);
        console.error("서버 응답 상태:", error.response?.status);
        console.error("서버 응답 헤더:", error.response?.headers);
      }
      toast.error("이미지 업로드에 실패했습니다.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검사: 이미지 파일인지 확인
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      toast.error(
        "JPG, PNG 등 이미지 파일만 선택할 수 있습니다. (SVG는 지원하지 않음)"
      );
      if (e.target) {
        e.target.value = "";
      }
      return;
    }

    try {
      const options = {
        maxSizeMB: 4,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
        alwaysKeepResolution: true,
        fileType: file.type,
      };

      console.log("이미지 압축 시작");
      const compressedFile = await imageCompression(file, options);
      console.log("압축된 파일 타입:", compressedFile.type);

      // 압축된 파일을 새로운 File 객체로 변환
      const finalFile = new File([compressedFile], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      uploadImageAndSendMessage(finalFile);
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error);
      toast.error("이미지 처리에 실패했습니다.");
    } finally {
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleBotMessage = () => {
    if (botInput.trim()) {
      // 마지막 질문으로부터 15초가 지났는지 확인
      if (botLastQuestionTime) {
        const now = new Date();
        const timeDiff = Math.floor(
          (now.getTime() - botLastQuestionTime.getTime()) / 1000
        );
        if (timeDiff < 15) {
          toast.error(`${15 - timeDiff}초 후에 질문할 수 있습니다.`);
          return; // 쿨타임 미만이면 전송 차단
        }
      }

      if (existingStompClient && existingStompClient.connected) {
        const botMessageBody = {
          roomId: roomId,
          message: botInput.trim(),
          isVisible: isVisibleToOpponent,
        };

        existingStompClient.publish({
          destination: "/app/api/chatbot/send",
          body: JSON.stringify(botMessageBody),
        });

        setBotLastQuestionTime(new Date()); // ★ 쿨타임 시작점 기록
        setBotRemainingTime(15); // ★ 추가! 즉시 15로 카운트다운 시작
        setBotInput("");
      } else {
        console.error("WebSocket 연결이 없습니다.");
        toast.error("챗봇 메시지 전송에 실패했습니다.");
      }
    }
  };

  const handleBotKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (botInput.trim()) {
        handleBotMessage();
      }
    }
  };

  const handleSecretaryMessage = () => {
    if (secretaryInput.trim() && existingStompClient?.connected) {
      const messageContent = secretaryInput.trim();

      if (lastQuestionTime) {
        const now = new Date();
        const timeDiff = Math.floor(
          (now.getTime() - lastQuestionTime.getTime()) / 1000
        );
        if (timeDiff < 15) {
          console.log("[비서봇] 질문 제한 시간 미달:", {
            remainingTime: 15 - timeDiff,
            lastQuestionTime,
            currentTime: now,
          });
          return;
        }
      }

      setLastQuestionTime(new Date());
      setRemainingTime(15); // ★ 추가! 보내자마자 바로 15초로 표시

      // 이하 동일
      setSecretaryMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: messageContent,
          createdAt: new Date(),
        },
      ]);

      existingStompClient.publish({
        destination: "/app/api/assistant/send",
        body: JSON.stringify({
          content: messageContent,
        }),
      });

      setSecretaryInput("");
    } else {
      console.log("[비서봇] 메시지 전송 실패:", {
        isConnected: existingStompClient?.connected,
        hasInput: secretaryInput.trim().length > 0,
      });
    }
  };

  const handleSecretaryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (secretaryInput.trim()) {
        handleSecretaryMessage();
      }
    }
  };

  return (
    <>
      {isSearchMode && (
        <div
          className="font-GanwonEduAll_Light w-full h-[82px] overflow-y-auto transition-all duration-300 ease-in-out"
          style={{ backgroundImage: `url(${navbg})`, backgroundSize: "cover" }}
        >
          <div className="flex items-center w-full max-w-md h-full px-2">
            <div className="flex-1 text-center text-white font-GanwonEduAll_Light text-base">
              {searchQuery.trim() === ""
                ? ""
                : searchResults.length > 0
                ? `${currentSearchIndex + 1}/${searchResults.length}`
                : "결과 없음"}
            </div>
            <div className="flex items-center ml-auto">
              <button
                onClick={() => onNavigateSearchResults("next")}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#743120] text-white mr-2 hover:bg-transparent"
              >
                <span className="relative -top-[1px]">▲</span>
              </button>
              <button
                onClick={() => onNavigateSearchResults("prev")}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#743120]  text-white hover:bg-transparent"
              >
                <span className="relative -top-[1px]">▼</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isSearchMode && (
        <div
          className={`font-GanwonEduAll_Light w-full overflow-y-auto transition-all duration-300 ease-in-out`}
          style={{
            height: emojiOpen ? 200 : 0,
            backgroundImage: `url(${navbg2})`,
          }}
        >
          <div className="h-full overflow-y-auto">
            {currentMenuType === "emoji" ? (
              // 이모티콘 메뉴
              <div className="grid grid-cols-4 px-2 bg-white m-4 rounded-lg">
                {emojis.map((emojiSrc, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-20 h-20 flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        if (!isRoomActive) {
                          toast.error(
                            "비활성화된 채팅방에서는 이모지를 보낼 수 없습니다."
                          );
                          return;
                        }
                        if (selectedEmojiUrl === emojiSrc) {
                          onSendMessage("", emojiSrc);
                          setSelectedEmojiUrl(null);
                        } else {
                          setSelectedEmojiUrl(emojiSrc);
                        }
                      }}
                    >
                      <img
                        src={emojiSrc}
                        alt={`emoji-${index + 1}`}
                        className="w-15 h-15"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // 일반 메뉴
              <div className="grid grid-cols-4 gap-y-4 px-6 pt-4">
                {[
                  {
                    icon: album_icon,
                    label: "앨범",
                    onClick: () => {
                      if (!isRoomActive) {
                        toast.error(
                          "비활성화된 채팅방에서는 이미지를 보낼 수 없습니다."
                        );
                        return;
                      }
                      fileInputRef.current?.click();
                    },
                    disabled: !isRoomActive,
                  },
                  {
                    icon: invite_icon,
                    label: "대면초대장",
                    onClick: onInviteClick,
                    disabled: !isRoomActive,
                  },
                  {
                    icon: end_icon,
                    label: "만남종료",
                    onClick: () => setShowEndModal(true),
                    disabled: !isRoomActive,
                  },
                  {
                    icon: report_icon,
                    label: "신고",
                    onClick: () => setShowReportModal(true),
                    disabled: !isRoomActive,
                  },
                  {
                    icon: survey_icon,
                    label: "비대면설문지",
                    onClick: onSurveyClick,
                    disabled: false,
                  },
                ].map(({ icon, label, onClick, disabled }, index) => (
                  <div
                    key={`utility-${index}`}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${
                        disabled ? "bg-gray-600" : "bg-[#722518]"
                      } flex items-center justify-center ${
                        disabled ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={disabled ? undefined : onClick}
                    >
                      <img src={icon} alt={label} className="w-6 h-6" />
                    </div>
                    <span className="text-white text-xs mt-1 text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedEmojiUrl && !isSearchMode && (
        <div
          className="absolute z-40 bg-white/50 w-full font-GanwonEduAll_Light  duration-300 transition-all "
          style={{
            bottom: emojiOpen ? 282 : 82,
          }}
        >
          <div className="bg-white rounded-lg ml-auto w-fit relative">
            {/* ✕ 닫기 버튼 */}
            <button
              onClick={() => setSelectedEmojiUrl(null)}
              className="absolute top-1 right-1 text-gray-400 hover:text-black"
              aria-label="미리보기 닫기"
            >
              ✕
            </button>

            <img
              src={selectedEmojiUrl}
              alt="Selected Emoji"
              className="w-30 h-30 p-2 shadow-lg rounded-lg "
            />
          </div>
        </div>
      )}

      {!isSearchMode && (
        <div
          className="font-GanwonEduAll_Light w-full h-[82px] px-2 flex items-center"
          style={{ backgroundImage: `url(${navbg})` }}
        >
          {!isBotMode && !isSearchMode && !isSecretaryMode && !emojiOpen && (
            <button
              className={`absolute right-2 z-20 w-11 h-11 rounded-full ${
                isRoomActive
                  ? "bg-[#743120] hover:bg-[#8a3d2d]"
                  : "bg-gray-600 cursor-not-allowed"
              } flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 translate-y-2 animate-[fadeIn_0.3s_ease-in-out_0.3s_forwards]`}
              style={{
                bottom: emojiOpen ? 302 : 102,
                transition:
                  "opacity 0.1s ease-in-out, transform 0.1s ease-in-out",
              }}
              onClick={
                isRoomActive
                  ? async () => {
                      setIsSecretaryMode(true);
                      setSecretaryInput("");
                      await fetchSecretaryHistory();
                    }
                  : undefined
              }
              disabled={!isRoomActive}
            >
              <img src={secretaryIcon} alt="secretary" className="w-7 h-7" />
            </button>
          )}
          <div className="flex items-center w-full gap-2">
            {isSecretaryMode ? (
              <>
                {/* 비서봇 모드: 좌측 X버튼 */}
                <button
                  className="w-9 h-9 rounded-full bg-[#743120] flex items-center justify-center flex-shrink-0"
                  onClick={() => {
                    setIsSecretaryMode(false);
                    setSecretaryInput("");
                  }}
                >
                  {/* 45도 회전된 + = X 아이콘 효과 */}
                  <img
                    src={plus_icon}
                    alt="close"
                    className="w-5 h-5 rotate-45 transition-transform duration-300"
                  />
                </button>

                {/* 비서봇 입력창 */}
                <div
                  className={`flex items-center flex-1 rounded-full px-3 py-2 ${
                    isRoomActive ? "bg-[#743120]" : "bg-gray-600"
                  }`}
                >
                  <img
                    src={secretaryIcon}
                    alt="secretary"
                    className="w-5 h-5 opacity-80 mr-2"
                  />
                  <input
                    type="text"
                    placeholder={
                      remainingTime > 0
                        ? `${remainingTime}초 후에 질문할 수 있습니다`
                        : "AI 비서에게 무엇이든 물어보기"
                    }
                    value={secretaryInput}
                    onChange={(e) => setSecretaryInput(e.target.value)}
                    onKeyPress={handleSecretaryKeyPress}
                    className="flex-1 bg-transparent text-white text-base placeholder:text-[#F2F2F280] outline-none"
                  />
                </div>

                {/* 전송 버튼 */}
                <button
                  onClick={handleSecretaryMessage}
                  className={`w-9 h-9 rounded-full ${
                    secretaryInput.trim() && remainingTime === 0
                      ? "bg-gray-200"
                      : "bg-[#743120]"
                  } flex items-center justify-center flex-shrink-0 ${
                    !secretaryInput.trim() || remainingTime > 0
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!secretaryInput.trim() || remainingTime > 0}
                >
                  <img src={arrow_icon} alt="send" className="w-5 h-5" />
                </button>
              </>
            ) : !isBotMode ? (
              <>
                {/* 좌측: 기능 열기 버튼 */}
                <button
                  className={`w-9 h-9 rounded-full bg-[#743120] 
                  flex items-center justify-center flex-shrink-0`}
                  onClick={onEmojiToggle}
                >
                  <img
                    src={plus_icon}
                    alt="plus"
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      emojiOpen && currentMenuType === "general"
                        ? "rotate-45"
                        : "rotate-0"
                    }`}
                  />
                </button>

                {/* 중앙: 일반 입력창 */}
                <div
                  className={`flex items-center flex-1 rounded-full px-3 py-0 h-[36px] ${
                    isRoomActive ? "bg-[#743120]" : "bg-gray-600"
                  }`}
                >
                  <input
                    type="text"
                    placeholder={
                      isRoomActive ? "전할 말 입력" : "비활성화된 채팅방입니다"
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isRoomActive}
                    className={`flex-1 bg-transparent text-white text-lg placeholder:text-[#F2F2F280] outline-none ${
                      !isRoomActive ? "cursor-not-allowed" : ""
                    }`}
                  />
                  <button
                    onClick={() => {
                      if (!isRoomActive) {
                        toast.error(
                          "비활성화된 채팅방에서는 이모지를 사용할 수 없습니다."
                        );
                        return;
                      }
                      if (!emojiOpen) {
                        onEmojiToggle();
                        setCurrentMenuType("emoji");
                      } else {
                        setCurrentMenuType(
                          currentMenuType === "general" ? "emoji" : "general"
                        );
                      }
                    }}
                  >
                    <img src={face_icon} alt="face" className="w-5 h-5 ml-2" />
                  </button>
                </div>

                {/* 우측: 전송 / 챗봇 진입 버튼 */}
                <button
                  onClick={() => {
                    if (!isRoomActive) return;

                    if (message.trim()) {
                      handleSendMessage();
                    } else {
                      setMessage("");
                      setIsBotMode(true);
                    }
                  }}
                  className={`w-9 h-9 rounded-full ${
                    isRoomActive
                      ? message.trim()
                        ? "bg-gray-300"
                        : "bg-[#743120]"
                      : "bg-gray-600"
                  } flex items-center justify-center flex-shrink-0 ${
                    !isRoomActive ? "cursor-not-allowed" : ""
                  }`}
                  disabled={!isRoomActive}
                >
                  <img
                    src={message.trim() ? arrow_icon : questionmark_icon}
                    alt={message.trim() ? "send" : "?"}
                    className="w-5 h-5"
                  />
                </button>
              </>
            ) : (
              <>
                {/* 챗봇 모드: 왼쪽 + 버튼 → X 역할 */}
                <button
                  className="w-9 h-9 rounded-full bg-[#743120] flex items-center justify-center flex-shrink-0"
                  onClick={() => {
                    setIsBotMode(false);
                    setBotInput("");
                  }}
                >
                  {/* 45도 회전된 + = X 아이콘 효과 */}
                  <img
                    src={plus_icon}
                    alt="close"
                    className="w-5 h-5 rotate-45 transition-transform duration-300"
                  />
                </button>

                {/* 챗봇 입력창 */}
                <div
                  className={`flex items-center flex-1 rounded-full px-3 py-2 ${
                    isRoomActive ? "bg-[#743120]" : "bg-gray-600"
                  }`}
                >
                  <img
                    src={questionmark_icon}
                    alt="?"
                    className="w-5 h-5 opacity-80 mr-2"
                  />
                  <input
                    type="text"
                    placeholder={
                      botRemainingTime > 0
                        ? `${botRemainingTime}초 후에 질문할 수 있습니다`
                        : "채팅 봇에게 요청/질문 내용 입력"
                    }
                    value={botInput}
                    onChange={(e) => setBotInput(e.target.value)}
                    onKeyPress={handleBotKeyPress}
                    disabled={botRemainingTime > 0}
                    className="flex-1 bg-transparent text-white text-base placeholder:text-[#F2F2F280] outline-none"
                    // 통일된 스타일 적용: text-base, placeholder색, flex-1 등
                  />
                </div>

                {/* 전송 버튼 */}
                <button
                  onClick={handleBotMessage}
                  className={`w-9 h-9 rounded-full ${
                    botInput.trim() && botRemainingTime === 0
                      ? "bg-gray-200"
                      : "bg-[#743120]"
                  } flex items-center justify-center flex-shrink-0 ${
                    !botInput.trim() || botRemainingTime > 0
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!botInput.trim() || botRemainingTime > 0}
                >
                  <img src={arrow_icon} alt="send" className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isBotMode && (
        <div className="font-GanwonEduAll_Light flex items-center justify-end px-4 py-2 border-b border-gray-200">
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-sm text-gray-600">
              상대방에게 보이기
            </span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isVisibleToOpponent}
                onChange={(e) => setIsVisibleToOpponent(e.target.checked)}
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  isVisibleToOpponent ? "bg-[#BD4B2C]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                    isVisibleToOpponent ? "transform translate-x-4" : ""
                  }`}
                />
              </div>
            </div>
          </label>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="User"
        targetUserId={receiverId}
        onSubmit={() => {}}
      />

      <EndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onSubmit={async (reasonCodes, customReason) => {
          console.log("[만남 종료 사유 전송]", {
            roomId,
            reasonCodes,
            customReason,
          });

          try {
            const endChatBody = {
              roomId: roomId,
              reasonCodes: reasonCodes.join(","), // 배열을 쉼표로 구분된 문자열로 변환
              customReason: customReason || null, // 빈 문자열이면 null로 처리
            };

            // WebSocket을 통해 만남 종료 사유 전송
            if (existingStompClient && existingStompClient.connected) {
              existingStompClient.publish({
                destination: "/app/api/chat/leave",
                body: JSON.stringify(endChatBody),
              });
              console.log("[만남 종료 사유 전송 성공]");
              onEndMeeting();
            } else {
              throw new Error("WebSocket 연결이 없습니다.");
            }
          } catch (error) {
            console.error("[만남 종료 사유 전송 실패]", error);
            toast.error("만남 종료 처리 중 오류가 발생했습니다.");
          }
          setShowEndModal(false);
        }}
      />

      <SecretaryModal
        isOpen={isSecretaryMode}
        onClose={() => setIsSecretaryMode(false)}
        messages={secretaryMessages}
        input={secretaryInput}
        setInput={setSecretaryInput}
        onSend={handleSecretaryMessage}
      />

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.1s ease-in-out forwards;
            animation-delay: 0.1s;
          }
        `}
      </style>
    </>
  );
}

export default ChatBar;

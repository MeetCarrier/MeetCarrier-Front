import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
// @ts-ignore
import "swiper/css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Utils/store";
import { UserState } from "../../Utils/userSlice";
import { fetchUser } from "../../Utils/userSlice";
import {
  setSurveyState,
  updateSurveyAnswers,
  setSubmitted,
  setOtherSubmitted,
  setHasJoinedChat,
} from "../../Utils/surveySlice";

import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import NavBar from "../../components/NavBar";
import FootPrintCheck from "./components/FootPrintCheck";
import menuIcon from "../../assets/img/icons/HobbyIcon/menu.svg";
import checkIcon from "../../assets/img/icons/HobbyIcon/check.svg";
import Modal from "../../components/Modal";
import exitIcon from "../../assets/img/icons/Survey/exit.svg";
import reportIcon from "../../assets/img/icons/Survey/report.svg";
import ReportModal from "../../components/ReportModal";

interface Question {
  questionId: number;
  content: string;
}

interface Answer {
  content: string;
  questionId: number;
  userId: number;
}

interface LocationState {
  sessionId: string | number;
}

interface MatchData {
  user1Id: number;
  user1Nickname: string;
  user2Id: number;
  user2Nickname: string;
  agreed: boolean;
  matchedAt?: string;
  status: string;
  id: number;
  sessionId: number;
}

function SurveyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const state = location.state as LocationState | undefined;
  const { sessionId } = useParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [chatRoomId, setChatRoomId] = useState<number | null>(() => {
    const sid = state?.sessionId || sessionId;
    const saved = localStorage.getItem(`chatRoomId_${sid}`);
    return saved ? parseInt(saved) : null;
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const menuButtonRef = useRef<HTMLImageElement>(null);

  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;
  const myId = user?.userId;
  const realSessionId = String(state?.sessionId || sessionId || "");
  const surveyState = useSelector(
    (state: RootState) => state.survey.surveys[realSessionId]
  );

  // 설문 상태 초기화 및 복원
  useEffect(() => {
    if (!realSessionId) return;

    // localStorage에서 상태 복원
    const savedState = localStorage.getItem(`survey_${realSessionId}`);
    if (savedState) {
      const { isSubmitted, isOtherSubmitted, hasJoinedChat, answers } =
        JSON.parse(savedState);
      dispatch(
        setSurveyState({
          sessionId: realSessionId,
          isSubmitted,
          isOtherSubmitted,
          hasJoinedChat,
          answers,
        })
      );
    } else {
      // 초기 상태 설정
      dispatch(
        setSurveyState({
          sessionId: realSessionId,
          isSubmitted: false,
          isOtherSubmitted: false,
          hasJoinedChat: false,
          answers: {},
        })
      );
    }
  }, [realSessionId, dispatch]);

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (realSessionId && surveyState) {
      localStorage.setItem(
        `survey_${realSessionId}`,
        JSON.stringify(surveyState)
      );
    }
  }, [surveyState, realSessionId]);

  // chatRoomId가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (chatRoomId && realSessionId) {
      localStorage.setItem(
        `chatRoomId_${realSessionId}`,
        chatRoomId.toString()
      );
    }
  }, [chatRoomId, realSessionId]);

  useEffect(() => {
    // 사용자 정보 가져오기
    dispatch(fetchUser());

    if (!realSessionId) {
      console.error("방 정보가 없습니다.");
      navigate(-1);
      return;
    }

    // WebSocket 연결 설정
    console.log("WebSocket 연결 시작");
    const socket = new SockJS(
      "https://www.mannamdeliveries.link/api/connection"
    );
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket 연결 성공");
        // 설문 완료 알림 구독
        stompClient.subscribe(
          `/topic/survey/${realSessionId}/complete`,
          async (message) => {
            const data = JSON.parse(message.body);
            console.log("[✔️ 설문 제출 알림 수신]", {
              destination: `/topic/survey/${realSessionId}/complete`,
              data,
            });

            try {
              // 최신 매치 상태 조회
              const response = await axios.get(
                `https://www.mannamdeliveries.link/api/matches`,
                { withCredentials: true }
              );
              const updatedMatch = response.data;

              // 상태 업데이트
              setChatRoomId(data.roomId);
              setShowCompleteModal(true);

              // location state 업데이트
              navigate(`/survey/${realSessionId}`, {
                state: {
                  ...state,
                  status: "Chatting",
                  agreed: updatedMatch.agreed,
                  matchedAt: updatedMatch.matchedAt,
                  sessionId: realSessionId,
                },
                replace: true,
              });
            } catch (error) {
              console.error("매치 상태 업데이트 실패:", error);
            }
          }
        );

        // 설문 퇴장 알림 구독
        stompClient.subscribe(
          `/topic/survey/${realSessionId}/leave`,
          (message) => {
            const data = JSON.parse(message.body);
            console.log("[❌ 설문 퇴장 알림 수신]", {
              destination: `/topic/survey/${realSessionId}/leave`,
              data,
            });
            alert(`${data.leaverNickname}님이 설문을 나갔습니다.`);
            navigate("/ChatList");
          }
        );
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

    // 질문 목록 조회
    const fetchQuestions = async () => {
      try {
        console.log("질문 목록 조회 시작");
        const response = await axios.get(
          `https://www.mannamdeliveries.link/api/survey/${realSessionId}/questions`,
          { withCredentials: true }
        );
        console.log("질문 목록 조회 결과:", response.data);
        setQuestions(response.data);
      } catch (error) {
        console.error("질문 목록 조회 실패:", error);
      }
    };

    // 답변 목록 조회
    const fetchAnswers = async () => {
      try {
        console.log("답변 목록 조회 시작");
        const response = await axios.get(
          `https://www.mannamdeliveries.link/api/survey/${realSessionId}/answers`,
          { withCredentials: true }
        );
        console.log("답변 목록 조회 결과:", response.data);
        setAnswers(response.data);

        // 기존 답변을 임시 저장소에 복사
        const existingAnswers = response.data
          .filter((a: Answer) => Number(a.userId) === myId)
          .reduce((acc: { [key: number]: string }, curr: Answer) => {
            acc[curr.questionId] = curr.content;
            return acc;
          }, {});
        dispatch(
          updateSurveyAnswers({
            sessionId: realSessionId,
            answers: existingAnswers,
          })
        );

        // userId의 종류 확인
        const uniqueUserIds = new Set(
          response.data.map((a: Answer) => a.userId)
        );
        console.log("답변한 사용자 ID 목록:", Array.from(uniqueUserIds));

        // 내 답변이 있는지 확인
        if (response.data.some((a: Answer) => Number(a.userId) === myId)) {
          dispatch(
            setSubmitted({
              sessionId: realSessionId,
              isSubmitted: true,
            })
          );
        }

        // 상대방 답변이 있는지 확인 (userId가 2개 이상이면 상대방도 답변한 것)
        if (uniqueUserIds.size >= 2) {
          dispatch(
            setOtherSubmitted({
              sessionId: realSessionId,
              isOtherSubmitted: true,
            })
          );
        }
      } catch (error) {
        console.error("답변 목록 조회 실패:", error);
      }
    };

    fetchQuestions();
    fetchAnswers();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [realSessionId, navigate, myId, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isClickInsideMenu = menuRef.current?.contains(e.target as Node);
      const isClickOnButton = menuButtonRef.current?.contains(e.target as Node);

      if (!isClickInsideMenu && !isClickOnButton) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.allowTouchMove = !isEditing;
      swiperRef.current.update();
    }
  }, [isEditing]);

  const handleBackClick = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedContent("");
    } else if (currentStep > 0) {
      navigate("/ChatList");
    } else {
      navigate("/ChatList");
    }
  };

  const handleSave = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion || !realSessionId) return;

    const updatedAnswers = {
      ...surveyState?.answers,
      [currentQuestion.questionId]: editedContent,
    };

    dispatch(
      updateSurveyAnswers({
        sessionId: realSessionId,
        answers: updatedAnswers,
      })
    );

    setIsEditing(false);
  };

  const handleSubmit = async () => {
    if (!realSessionId || !myId) return;

    try {
      console.log("설문 제출 시작");

      const answersToSubmit = Object.entries(surveyState?.answers || {}).map(
        ([questionId, content]) => ({
          questionId: parseInt(questionId),
          content: content,
        })
      );

      await axios.post(
        `https://www.mannamdeliveries.link/api/survey/${realSessionId}/${myId}/answers`,
        answersToSubmit,
        { withCredentials: true }
      );

      console.log("설문 제출 성공");
      setShowSubmitModal(false);
      dispatch(
        setSubmitted({
          sessionId: realSessionId,
          isSubmitted: true,
        })
      );
      setShowSubmittedModal(true);
    } catch (error) {
      console.error("설문 제출 실패:", error);
      alert("설문 제출에 실패했습니다.");
    }
  };

  // 모든 질문에 답변했는지 확인
  const isAllQuestionsAnswered = () => {
    return questions.every(
      (question) => surveyState?.answers[question.questionId]
    );
  };

  const getLabeledQuestionTitle = (index: number, total: number) => {
    const labels = ["첫", "두", "세", "네"];
    return index === total - 1 ? "마지막-질문" : `${labels[index]}번째-질문`;
  };

  const handleJoinChat = async () => {
    console.log("채팅방 참가 시도:", {
      realSessionId,
      myId,
      matchData,
    });

    if (!realSessionId || !myId) {
      console.error("필수 정보 누락:", { realSessionId, myId });
      alert("필수 정보가 누락되었습니다.");
      return;
    }

    if (!matchData?.id) {
      console.error("매치 ID가 없습니다.");
      alert("매치 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      console.log("채팅방 입장 API 요청 시작");
      const response = await axios.post(
        `https://www.mannamdeliveries.link/api/room/${matchData.id}/${myId}/enter`,
        null,
        { withCredentials: true }
      );
      console.log("채팅방 입장 API 응답:", response.data);

      const newRoomId = response.data.roomId;
      setChatRoomId(newRoomId);
      dispatch(
        setHasJoinedChat({
          sessionId: realSessionId,
          hasJoinedChat: true,
        })
      );
      navigate(`/chat/${newRoomId}`, {
        state: {
          ...matchData,
          roomId: newRoomId,
        },
      });
    } catch (error) {
      console.error("채팅방 입장 요청 실패:", error);
      alert("채팅방에 입장할 수 없습니다.");
    }
  };

  // 매치 데이터 가져오기
  useEffect(() => {
    const fetchMatchData = async () => {
      const realSessionId = String(state?.sessionId || sessionId || "");
      if (!realSessionId) return;

      try {
        const response = await axios.get(
          "https://www.mannamdeliveries.link/api/matches",
          { withCredentials: true }
        );
        const match = response.data.find(
          (m: MatchData) => m.sessionId === Number(realSessionId)
        );
        if (!match) {
          throw new Error("매치를 찾을 수 없습니다.");
        }
        setMatchData(match);
      } catch (error) {
        console.error("매치 데이터 조회 실패:", error);
        navigate("/ChatList");
      }
    };

    fetchMatchData();
  }, [state?.sessionId, sessionId, navigate]);

  // userId로 내 정보/상대 정보 구분
  let myNickname = "나";
  let otherNickname = "상대방";
  if (user?.userId === matchData?.user1Id) {
    myNickname = matchData?.user1Nickname || myNickname;
    otherNickname = matchData?.user2Nickname || otherNickname;
  } else if (user?.userId === matchData?.user2Id) {
    myNickname = matchData?.user2Nickname || myNickname;
    otherNickname = matchData?.user1Nickname || otherNickname;
  }

  return (
    <>
      <NavBar />

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">질문 센터</p>
        <img
          ref={menuButtonRef}
          src={isEditing ? checkIcon : menuIcon}
          alt={isEditing ? "저장" : "메뉴"}
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          onClick={
            isEditing ? handleSave : () => setIsMenuOpen((prev) => !prev)
          }
        />
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-[90px] right-6 bg-white shadow-md rounded-xl  z-50 flex flex-col w-32 py-2"
          style={{ minWidth: "120px" }}
        >
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:bg-gray-100 w-full text-left font-GanwonEduAll_Light"
            onClick={() => {
              if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.publish({
                  destination: "/app/api/survey/leave",
                  body: JSON.stringify({
                    sessionId: realSessionId,
                    leaverId: myId,
                    leaverNickname:
                      myId === Number(matchData?.user1Id)
                        ? matchData?.user1Nickname
                        : matchData?.user2Nickname,
                  }),
                });
              }
              setIsMenuOpen(false);
              navigate("/ChatList");
            }}
          >
            <img src={exitIcon} alt="만남 종료" className="w-5 h-5 mr-1" />
            <span>만남 종료</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#BD4B2C] hover:bg-gray-100 w-full text-left font-GanwonEduAll_Light"
            onClick={() => {
              setIsMenuOpen(false);
              setShowReportModal(true);
            }}
          >
            <img src={reportIcon} alt="신고" className="w-5 h-5 mr-1" />
            <span>신고</span>
          </button>
        </div>
      )}

      <div className="w-full h-[calc(100%-200px)] px-4 z-0 font-GanwonEduAll_Light">
        <FootPrintCheck currentStep={currentStep + 1} />

        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          centeredSlides={false}
          allowTouchMove={!isEditing}
          onSlideChange={(swiper) => {
            setCurrentStep(swiper.activeIndex);
            setIsEditing(false);
            setEditedContent("");
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="py-6"
        >
          {questions.map((question, index) => {
            const allAnswers = answers.filter(
              (a) => a.questionId === question.questionId
            );

            const myAnswer = allAnswers.find((a) => Number(a.userId) === myId);
            const otherAnswer = allAnswers.find(
              (a) => Number(a.userId) !== myId
            );

            const showOther = !isEditing;
            const currentAnswer =
              surveyState?.answers[question.questionId] ||
              myAnswer?.content ||
              "";

            return (
              <SwiperSlide key={question.questionId}>
                <p className="mt-6 text-md font-GanwonEduAll_Bold mb-1 text-[#333]">
                  {question.content}
                </p>

                <div className="flex justify-between items-end mb-4">
                  <div className="flex items-center text-sm text-[#333] font-GanwonEduAll_Bold">
                    {getLabeledQuestionTitle(index, questions.length)
                      .split("")
                      .map((char, i) =>
                        char === "-" ? (
                          <span key={i} className="mx-[2px]">
                            {char}
                          </span>
                        ) : (
                          <span
                            key={i}
                            className="border border-[#BD4B2C] px-2 py-[4px] mx-[1px] tracking-wide"
                          >
                            {char}
                          </span>
                        )
                      )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {matchData?.matchedAt
                      ? new Date(matchData.matchedAt).toLocaleDateString(
                          "ko-KR"
                        )
                      : ""}
                  </p>
                </div>

                {/* 내 답변 */}
                <div
                  className={`bg-white rounded p-4 shadow-sm border border-gray-200 mb-3 min-h-[150px] overflow-y-auto ${
                    !surveyState?.isSubmitted ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (!isEditing && !surveyState?.isSubmitted) {
                      setIsEditing(true);
                      setEditedContent(currentAnswer);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {myNickname}
                    </p>
                  </div>
                  {isEditing ? (
                    <textarea
                      className="w-full h-32 border rounded p-2 text-sm"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                  ) : (
                    <p className="text-xs text-gray-600">
                      {currentAnswer ? (
                        currentAnswer
                      ) : (
                        <>
                          이곳을 눌러 떠오르는 생각을 남겨보세요.
                          <br />
                          친구는 답변을 통해 당신을 알아가게 될 거예요.
                        </>
                      )}
                    </p>
                  )}
                </div>

                {/* 상대방 답변 (수정 중이면 숨김) */}
                {showOther && (
                  <div className="bg-white rounded p-4 shadow-sm border border-gray-200 mb-3 min-h-[150px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {otherNickname}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-pre-line">
                      {otherAnswer?.content ?? "아직 작성하지 않았어요."}
                    </p>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {!surveyState?.isSubmitted &&
          !isEditing &&
          isAllQuestionsAnswered() && (
            <div className="flex justify-center mt-4">
              <button
                className="px-6 py-2 bg-[#C67B5A] text-white text-sm font-GanwonEduAll_Bold rounded-md"
                onClick={() => setShowSubmitModal(true)}
              >
                제출하기
              </button>
            </div>
          )}
      </div>

      {/* 제출 확인 모달 */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)}>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-GanwonEduAll_Bold mb-4">제출 확인</h3>
          <p className="text-sm mb-6 text-center">
            답변을 등록하시겠어요?
            <br />
            등록 후에는 수정이 불가능해요.
          </p>
          <div className="flex justify-center gap-4 w-full">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setShowSubmitModal(false)}
            >
              취소
            </button>
            <button
              className="px-4 py-2 bg-[#C67B5A] text-white text-sm rounded whitespace-pre-line"
              onClick={handleSubmit}
            >
              제출하기
            </button>
          </div>
        </div>
      </Modal>

      {/* 설문 완료 모달 */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          // 설문 완료 모달이 닫힐 때 채팅방 입장 요청
          handleJoinChat();
        }}
      >
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-GanwonEduAll_Bold mb-4">설문 완료!</h3>
          <p className="text-sm mb-6 text-center">
            둘 다 모든 설문에 답변했어요!
          </p>
          <div className="flex justify-center w-full">
            <button
              className="px-6 py-2 bg-[#C67B5A] text-white text-sm rounded"
              onClick={() => {
                setShowCompleteModal(false);
              }}
            >
              답변 확인하기
            </button>
          </div>
        </div>
      </Modal>

      {/* 제출 완료 안내 모달 */}
      <Modal
        isOpen={showSubmittedModal}
        onClose={() => setShowSubmittedModal(false)}
      >
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-GanwonEduAll_Bold mb-4">
            답변 제출 완료!
          </h3>
          <p className="text-sm mb-6 text-center">
            답변을 제출했어요.
            <br />
            상대방의 답변이 올 때까지 같이 기다려봐요.
          </p>
          <div className="flex justify-center w-full">
            <button
              className="px-6 py-2 bg-[#C67B5A] text-white text-sm rounded"
              onClick={() => setShowSubmittedModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>

      {/* 채팅방 참가 버튼 */}
      {matchData?.status === "Chatting" &&
        !matchData.agreed &&
        !showCompleteModal &&
        surveyState?.isSubmitted &&
        surveyState?.isOtherSubmitted &&
        !surveyState?.hasJoinedChat && (
          <div className="fixed bottom-30 left-0 right-0 flex justify-center">
            <button
              className="px-6 py-3 bg-[#C67B5A] text-white text-sm font-GanwonEduAll_Bold rounded-full shadow-lg"
              onClick={handleJoinChat}
            >
              채팅방 참가하기
            </button>
          </div>
        )}

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="Question"
        onSubmit={(reasons, content) => {
          alert(
            "신고가 접수되었습니다.\n사유: " +
              reasons.join(", ") +
              "\n내용: " +
              content
          );
        }}
      />
    </>
  );
}

export default SurveyPage;

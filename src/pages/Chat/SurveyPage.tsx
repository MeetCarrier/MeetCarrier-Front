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
import { fetchUserById, UserProfileData } from "../../Utils/api";
import toast from "react-hot-toast";

import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import NavBar from "../../components/NavBar";
import FootPrintCheck from "./components/FootPrintCheck";
import menuIcon from "../../assets/img/icons/HobbyIcon/menu.svg";
import checkIcon from "../../assets/img/icons/HobbyIcon/check.svg";
import Modal from "../../components/Modal";
import exitIcon from "../../assets/img/icons/Survey/exit.svg";
import reportIcon from "../../assets/img/icons/Survey/report.svg";
import ReportModal from "../../components/ReportModal";
import largeNextButton from "../../assets/img/icons/Login/l_btn_fill.svg";
import smallNextButtonEmpty from '../../assets/img/icons/Login/s_btn_empty.svg';
import smallNextButtonFill from '../../assets/img/icons/Login/s_btn_fill.svg';
import ProfileModal from "../../components/ProfileModal";
import EndModal from "../../components/EndModal";
import SurveySlide from "./components/SurveySlide";

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(
    null
  );
  const [showEndModal, setShowEndModal] = useState(false);
  const [showOpponentLeaveModal, setShowOpponentLeaveModal] = useState(false);
  const [leaverNickname, setLeaverNickname] = useState("");

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

      // localStorage의 답변과 서버의 답변을 병합
      const fetchAndMergeAnswers = async () => {
        try {
          const response = await axios.get(
            `https://www.mannamdeliveries.link/api/survey/${realSessionId}/answers`,
            { withCredentials: true }
          );

          const serverAnswers = response.data
            .filter((a: Answer) => Number(a.userId) === myId)
            .reduce((acc: { [key: number]: string }, curr: Answer) => {
              acc[curr.questionId] = curr.content;
              return acc;
            }, {});

          // localStorage의 답변과 서버의 답변을 병합
          const mergedAnswers = {
            ...answers,
            ...serverAnswers,
          };

          // 현재 질문의 답변이 있으면 편집 모드에서 표시
          const currentQuestion = questions[currentStep];
          if (currentQuestion && mergedAnswers[currentQuestion.questionId]) {
            setEditedContent(mergedAnswers[currentQuestion.questionId]);
          }

          dispatch(
            setSurveyState({
              sessionId: realSessionId,
              isSubmitted: isSubmitted || Object.keys(serverAnswers).length > 0,
              isOtherSubmitted: isOtherSubmitted, // localStorage의 값 사용
              hasJoinedChat,
              answers: mergedAnswers,
            })
          );
        } catch (error) {
          console.error("답변 병합 실패:", error);
          // 서버 요청 실패 시 localStorage의 상태만 사용
          dispatch(
            setSurveyState({
              sessionId: realSessionId,
              isSubmitted,
              isOtherSubmitted: isOtherSubmitted, // localStorage의 값 사용
              hasJoinedChat,
              answers,
            })
          );
        }
      };

      fetchAndMergeAnswers();
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
  }, [realSessionId, dispatch, myId, currentStep, questions]);

  // 상태 변경 시 localStorage에 저장 (디바운스 적용)
  useEffect(() => {
    if (!realSessionId || !surveyState) return;

    const timeoutId = setTimeout(() => {
      localStorage.setItem(
        `survey_${realSessionId}`,
        JSON.stringify(surveyState)
      );
    }, 500); // 500ms 디바운스

    return () => clearTimeout(timeoutId);
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
              const updatedMatchDataArray = response.data;
              const currentSessionMatch = updatedMatchDataArray.find(
                (m: MatchData) => m.sessionId === Number(realSessionId)
              );

              if (currentSessionMatch) {
                setMatchData(currentSessionMatch); // 매치 데이터 상태 업데이트
                setChatRoomId(data.roomId);
                setShowCompleteModal(true);

                // location state 업데이트 (matchData에서 정확한 상태 정보 사용)
                navigate(`/survey/${realSessionId}`, {
                  state: {
                    ...state,
                    status: "Chatting",
                    agreed: currentSessionMatch.agreed,
                    matchedAt: currentSessionMatch.matchedAt,
                    sessionId: realSessionId,
                  },
                  replace: true,
                });

                // 상대방 답변 제출 후 answers 상태 갱신
                await fetchAnswers();
              } else {
                console.error("현재 세션에 대한 매치를 찾을 수 없습니다.");
              }
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
            setLeaverNickname(data.leaverNickname);
            setShowOpponentLeaveModal(true);
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

        // 상대방 답변이 있는지 확인 (다시 추가)
        if (myId !== undefined) {
          const hasOtherUser = response.data.some(
            (a: Answer) => Number(a.userId) !== myId
          );

          if (hasOtherUser) {
            dispatch(
              setOtherSubmitted({
                sessionId: realSessionId,
                isOtherSubmitted: true,
              })
            );
          } else {
            dispatch(
              setOtherSubmitted({
                sessionId: realSessionId,
                isOtherSubmitted: false,
              })
            );
          }
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

  // isOtherSubmitted를 위한 전용 useEffect (재도입 및 개선)
  useEffect(() => {
    if (!realSessionId || myId === undefined || !answers) return;

    // answers 배열 내에서 나의 userId가 아닌 다른 userId의 답변이 있는지 확인
    const hasOtherUserAnswer = answers.some(
      (a: Answer) => Number(a.userId) !== myId
    );

    dispatch(
      setOtherSubmitted({
        sessionId: realSessionId,
        isOtherSubmitted: hasOtherUserAnswer,
      })
    );
  }, [realSessionId, myId, dispatch, answers]);

  const handleBackClick = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedContent("");
    } else if (currentStep > 0) {
      navigate(-1);
    } else {
      navigate(-1);
    }
  };

  const handleSave = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion || !realSessionId) return;

    const updatedAnswers = {
      ...surveyState?.answers,
      [currentQuestion.questionId]: editedContent,
    };

    // Redux 상태 업데이트
    dispatch(
      updateSurveyAnswers({
        sessionId: realSessionId,
        answers: updatedAnswers,
      })
    );

    // localStorage에 즉시 저장
    const currentState = {
      ...surveyState,
      answers: updatedAnswers,
    };
    localStorage.setItem(
      `survey_${realSessionId}`,
      JSON.stringify(currentState)
    );

    setIsEditing(false);
    setEditedContent("");
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
      toast.error("설문 제출에 실패했습니다.");
    }
  };

  // 모든 질문에 답변했는지 확인
  const isAllQuestionsAnswered = () => {
    return questions.every(
      (question) => surveyState?.answers[question.questionId]
    );
  };

  const handleJoinChat = async () => {
    console.log("채팅방 참가 시도:", {
      realSessionId,
      myId,
      matchData,
    });

    if (!realSessionId || !myId) {
      console.error("필수 정보 누락:", {
        realSessionId,
        myId,
      });
      toast.error("필수 정보가 누락되었습니다.");
      return;
    }

    if (!matchData?.id) {
      console.error("매치 ID가 없습니다.");
      toast.error("매치 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      console.log("채팅방 입장 API 요청 시작");
      const response = await axios.post(
        `https://www.mannamdeliveries.link/api/room/${matchData.id}/enter`,
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

      // navigate 호출 전에 필요한 모든 정보가 있는지 확인
      if (!matchData) {
        console.error("매치 데이터가 없습니다.");
        toast.error("채팅방 정보를 찾을 수 없습니다.");
        return;
      }

      // 필요한 모든 정보를 포함하여 navigate
      navigate(`/chat/${newRoomId}`, {
        state: {
          id: matchData.id,
          sessionId: Number(realSessionId),
          user1Id: matchData.user1Id,
          user1Nickname: matchData.user1Nickname,
          user2Id: matchData.user2Id,
          user2Nickname: matchData.user2Nickname,
          agreed: matchData.agreed,
          matchedAt: matchData.matchedAt,
          status: matchData.status,
          roomId: newRoomId,
        },
      });
    } catch (error) {
      console.error("채팅방 입장 요청 실패:", error);
      toast.error("채팅방에 입장할 수 없습니다.");
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

  const handleEndSurvey = async (
    reasonCodes: string[],
    customReason: string
  ) => {
    if (!realSessionId || !myId) return;

    try {
      if (stompClientRef.current && stompClientRef.current.connected) {
        const endSurveyBody = {
          sessionId: Number(realSessionId),
          reasonCodes: reasonCodes.join(","),
          customReason: customReason,
        };
        console.log("[만남 종료 사유 전송]", endSurveyBody);

        stompClientRef.current.publish({
          destination: "/app/api/survey/leave",
          body: JSON.stringify(endSurveyBody),
        });

        navigate("/ChatList");
      } else {
        throw new Error("WebSocket 연결이 없습니다.");
      }
    } catch (error) {
      console.error("만남 종료 처리 실패:", error);
      toast.error("만남 종료 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <NavBar />

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-5 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">질문 센터</p>
        {(matchData?.status === "Surveying" ||
          (matchData?.status === "Chatting" && !matchData?.agreed)) &&
          !isEditing && (
            <img
              ref={menuButtonRef}
              src={menuIcon}
              alt="메뉴"
              className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />
          )}
        {(matchData?.status === "Surveying" ||
          (matchData?.status === "Chatting" && !matchData?.agreed)) &&
          isEditing && (
            <img
              ref={menuButtonRef}
              src={checkIcon}
              alt="저장"
              className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
              onClick={handleSave}
            />
          )}
      </div>

      {isMenuOpen &&
        (matchData?.status === "Surveying" ||
          (matchData?.status === "Chatting" && !matchData?.agreed)) && (
          <div
            ref={menuRef}
            className="absolute top-[90px] right-6 bg-white shadow-md rounded-xl  z-50 flex flex-col w-32 py-2"
            style={{ minWidth: "120px" }}
          >
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#333] hover:bg-gray-100 w-full text-left font-GanwonEduAll_Light"
              onClick={() => {
                setIsMenuOpen(false);
                setShowEndModal(true);
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

      <div className="w-full h-[calc(100%-200px)] relative min-h-0 px-4 z-0 font-GanwonEduAll_Light">
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
          className="h-full min-h-0 py-6"
        >
          {questions.map((question, index) => (
            <SwiperSlide
              key={question.questionId}
              className="h-full flex flex-col min-h-0"
            >
              <SurveySlide
                question={question}
                index={index}
                questionsLength={questions.length}
                allAnswers={answers}
                myId={myId ?? null}
                myNickname={myNickname}
                otherNickname={otherNickname}
                isEditing={isEditing}
                surveyState={surveyState}
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                setIsEditing={setIsEditing}
                matchData={matchData}
                onProfileClick={handleProfileClick}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {matchData?.status === "Surveying" &&
          !surveyState?.isSubmitted &&
          !isEditing &&
          isAllQuestionsAnswered() && (
            <div className="fixed bottom-[90px] left-0 right-0 flex justify-center z-30">
              <button
                onClick={() => setShowSubmitModal(true)}
                className={
                  "relative w-full max-w-[400px] h-[45px] flex items-center justify-center overflow-hidden transition-opacity duration-200"
                }
              >
                <img
                  src={largeNextButton}
                  alt="제출하기"
                  className="absolute inset-0 w-full h-full px-4 object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-[#333]">
                  제출하기
                </span>
              </button>
            </div>
          )}
      </div>
      <FootPrintCheck currentStep={currentStep + 1} />

      {/* 제출 확인 모달 */}
      <Modal hideCloseButton={true} isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)}>
        <div className="flex flex-col items-center  font-GanwonEduAll_Light  text-base">
          <h3 className="text-lg font-bold">제출 확인</h3>
          <p className="text-base my-4 text-center">
            답변을 등록하시겠어요?
            <br />
            등록 후에는 수정이 불가능해요.
          </p>
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="relative w-[120px] h-[40px] flex items-center justify-center overflow-hidden"
            >
              <img
                src={smallNextButtonEmpty}
                alt="취소"
                className="absolute inset-0 w-full h-full object-fill"
              />
              <span className="relative z-10 text-sm text-[#333] font-GanwonEduAll_Bold">
                취소
              </span>
            </button>

            <button
              onClick={handleSubmit}
              className="relative w-[120px] h-[40px] flex items-center justify-center overflow-hidden"
            >
              <img
                src={smallNextButtonFill}
                alt="제출하기"
                className="absolute inset-0 w-full h-full object-fill"
              />
              <span className="relative z-10 text-sm text-white font-GanwonEduAll_Bold">
                제출하기
              </span>
            </button>
          </div>
        </div>
      </Modal>

      {/* 설문 완료 모달 */}
      <Modal
        hideCloseButton={true}
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          // 설문 완료 모달이 닫힐 때 채팅방 입장 요청 (삭제)
          // handleJoinChat(); // 이 부분은 이제 '채팅방 참가하기' 버튼 클릭 시에만 호출됨
        }}
      >
        <div className="flex flex-col items-center  font-GanwonEduAll_Light  text-base">
          <h3 className="text-lg  font-bold mb-4">설문 완료!</h3>
          <p className="text-sm mb-6 text-center ">
            둘 다 모든 설문에 답변했어요!
          </p>
          <div className="flex justify-center w-full">
            <button
              className="relative w-[120px] h-[40px] flex items-center justify-center overflow-hidden"
              onClick={() => {
                setShowCompleteModal(false);
              }}
            >
              <img
                src={smallNextButtonFill}
                alt="답변 확인하기"
                className="absolute inset-0 w-full h-full object-fill"
              />
              <span className="relative z-10 text-sm text-white font-GanwonEduAll_Bold">
                답변 확인하기
              </span>
            </button>

          </div>
        </div>
      </Modal>

      {/* 제출 완료 안내 모달 */}
      <Modal
        hideCloseButton={true}
        isOpen={showSubmittedModal}
        onClose={() => setShowSubmittedModal(false)}
      >
        <div className="flex flex-col items-center  font-GanwonEduAll_Light  text-base">
          <h3 className="text-lg  font-bold mb-4">
            답변 제출 완료!
          </h3>
          <p className="text-sm mb-6 text-center">
            답변을 제출했어요.
            <br />
            상대방의 답변이 올 때까지 같이 기다려봐요.
          </p>
          <div className="flex justify-center w-full">
            <button
              className="relative w-[120px] h-[40px] flex items-center justify-center overflow-hidden"
              onClick={() => setShowSubmittedModal(false)}
            >
              <img
                src={smallNextButtonFill}
                alt="확인"
                className="absolute inset-0 w-full h-full object-fill"
              />
              <span className="relative z-10 text-sm text-white font-GanwonEduAll_Bold">
                확인
              </span>
            </button>

          </div>
        </div>
      </Modal>

      {matchData?.status === "Chatting" &&
        !matchData.agreed &&
        !showCompleteModal &&
        surveyState?.isSubmitted &&
        surveyState?.isOtherSubmitted &&
        !surveyState?.hasJoinedChat && (
          <div className="fixed bottom-[90px] left-0 right-0 flex justify-center z-30">
            <button
              onClick={handleJoinChat}
              className={
                "  px-4 relative w-full max-w-[400px] h-[45px] flex items-center justify-center overflow-hidden transition-opacity duration-200"
              }
            >
              <img
                src={largeNextButton}
                alt="채팅방 참가하기"
                className="px-4 absolute inset-0 w-full h-full object-fill"
              />
              <span className="relative z-10 font-GanwonEduAll_Bold text-[#333]">
                채팅방 참가하기
              </span>
            </button>
          </div>
        )}

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="User"
        targetUserId={
          matchData?.user1Id === myId ? matchData?.user2Id : matchData?.user1Id
        }
        onSubmit={async (reasons, content) => {
          try {
            const reportBody = {
              sessionId: Number(realSessionId),
              reasonCodes: reasons.join(","),
              customReason: content,
            };
            console.log("[설문 신고 전송]", reportBody);

            await axios.post(
              "https://www.mannamdeliveries.link/api/reports/register",
              reportBody,
              { withCredentials: true }
            );
            toast.success("신고가 접수되었습니다.");
            setShowReportModal(false);
          } catch (error) {
            console.error("신고 처리 실패:", error);
            toast.error("신고 처리 중 오류가 발생했습니다.");
          }
        }}
      />

      {showProfileModal && selectedUser && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={selectedUser}
        />
      )}

      <EndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onSubmit={handleEndSurvey}
      />

      {/* 상대방 퇴장 모달 */}
      <Modal
        isOpen={showOpponentLeaveModal}
        onClose={() => {
          setShowOpponentLeaveModal(false);
          navigate("/ChatList");
        }}
      >
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-GanwonEduAll_Bold mb-4">
            상대방이 나갔습니다
          </h3>
          <p className="text-sm mb-6 text-center">
            {leaverNickname}님이 설문을 나갔습니다.
          </p>
          <div className="flex justify-center w-full">
            <button
              className="px-6 py-2 bg-[#C67B5A] text-white text-sm rounded"
              onClick={() => {
                setShowOpponentLeaveModal(false);
                navigate("/ChatList");
              }}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SurveyPage;

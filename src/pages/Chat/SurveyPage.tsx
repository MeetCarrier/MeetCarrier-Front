import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import NavBar from "../../components/NavBar";
import FootPrintCheck from "./components/FootPrintCheck";
import menuIcon from "../../assets/img/icons/HobbyIcon/menu.svg";
import checkIcon from "../../assets/img/icons/HobbyIcon/check.svg";

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
  roomId: number;
  user1Id: number;
  user1Nickname: string;
  user2Id: number;
  user2Nickname: string;
}

function SurveyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { user1Id, user1Nickname, user2Id, user2Nickname, roomId } = state || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tempAnswers, setTempAnswers] = useState<{[key: number]: string}>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const myId = user1Id; // 현재 로그인한 사용자 ID

  useEffect(() => {
    if (!state?.roomId) {
      console.error('방 정보가 없습니다.');
      navigate(-1);
      return;
    }

    // WebSocket 연결 설정
    console.log('WebSocket 연결 시작');
    const socket = new SockJS('https://www.mannamdeliveries.link/connection');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket 연결 성공');
      
        // 설문 완료 알림 구독
        stompClient.subscribe(`/topic/survey/${state.roomId}/complete`, (message) => {
          const data = JSON.parse(message.body);
          console.log('[✔️ 설문 제출 알림 수신]', {
            destination: `/topic/survey/${state.roomId}/complete`,
            data,
          });
          navigate(`/chat/${data.roomId}`);
        });
      
        // 설문 퇴장 알림 구독
        stompClient.subscribe(`/topic/survey/${state.roomId}/leave`, (message) => {
          const data = JSON.parse(message.body);
          console.log('[❌ 설문 퇴장 알림 수신]', {
            destination: `/topic/survey/${state.roomId}/leave`,
            data,
          });
          alert(`${data.leaverNickname}님이 설문을 나갔습니다.`);
          navigate(-1);
        });
      },
      
      onDisconnect: () => {
        console.log('WebSocket 연결 해제');
      },
      onStompError: (frame) => {
        console.error('STOMP 에러 발생:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket 에러 발생:', event);
      }
    });

    stompClientRef.current = stompClient;
    stompClient.activate();

    // 질문 목록 조회
    const fetchQuestions = async () => {
      try {
        console.log('질문 목록 조회 시작');
        const response = await axios.get(`https://www.mannamdeliveries.link/survey/${state.roomId}/questions`);
        console.log('질문 목록 조회 결과:', response.data);
        setQuestions(response.data);
      } catch (error) {
        console.error('질문 목록 조회 실패:', error);
      }
    };

    // 답변 목록 조회
    const fetchAnswers = async () => {
      try {
        console.log('답변 목록 조회 시작');
        const response = await axios.get(`https://www.mannamdeliveries.link/survey/${state.roomId}/answers`);
        console.log('답변 목록 조회 결과:', response.data);
        setAnswers(response.data);
        
        // 기존 답변을 임시 저장소에 복사
        const existingAnswers = response.data
          .filter((a: Answer) => a.userId === myId)
          .reduce((acc: {[key: number]: string}, curr: Answer) => {
            acc[curr.questionId] = curr.content;
            return acc;
          }, {});
        setTempAnswers(existingAnswers);
      } catch (error) {
        console.error('답변 목록 조회 실패:', error);
      }
    };

    fetchQuestions();
    fetchAnswers();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [state?.roomId, navigate, myId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSave = () => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) return;

    // 임시 저장소에 답변 저장
    setTempAnswers(prev => ({
      ...prev,
      [currentQuestion.questionId]: editedContent
    }));
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      console.log('설문 제출 시작');
      
      // 모든 답변을 배열로 변환 (userId 제외)
      const answersToSubmit = Object.entries(tempAnswers).map(([questionId, content]) => ({
        questionId: parseInt(questionId),
        content: content
      }));

      console.log('제출할 답변:', answersToSubmit);

      // 모든 답변을 한 번에 제출
      await axios.post(
        `https://www.mannamdeliveries.link/survey/${state.roomId}/answers/${myId}`,
        answersToSubmit
      );

      console.log('설문 제출 성공');
      alert('모든 질문이 완료되었습니다!');
    } catch (error) {
      console.error('설문 제출 실패:', error);
      alert('설문 제출에 실패했습니다.');
    }
  };

  // 모든 질문에 답변했는지 확인
  const isAllQuestionsAnswered = () => {
    return questions.every(question => tempAnswers[question.questionId]);
  };

  const getLabeledQuestionTitle = (index: number, total: number) => {
    const labels = ["첫", "두", "세", "네"];
    return index === total - 1 ? "마지막-질문" : `${labels[index]}번째-질문`;
  };

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
          className="absolute top-[90px] right-6 bg-white shadow-md rounded border z-50"
        >
          <button
            className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left font-GanwonEduAll_Light"
            onClick={() => {
              if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.publish({
                  destination: '/app/survey/leave',
                  body: JSON.stringify({
                    sessionId: state.roomId,
                    leaverId: myId,
                    leaverNickname: myId === user1Id ? user1Nickname : user2Nickname
                  })
                });
              }
              setIsMenuOpen(false);
              navigate(-1);
            }}
          >
            설문 나가기
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
            const myAnswer = allAnswers.find((a) => a.userId === myId);
            const otherAnswer = allAnswers.find((a) => a.userId !== myId);

            const myNickname = myId === user1Id ? user1Nickname : user2Nickname;
            const otherNickname =
              myId === user1Id ? user2Nickname : user1Nickname;

            const showOther = !isEditing;
            const currentAnswer = tempAnswers[question.questionId] || myAnswer?.content || "";

            return (
              <SwiperSlide key={question.questionId}>
                <p className="mt-18 text-md font-GanwonEduAll_Bold mb-1 text-[#333]">
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
                  <p className="text-xs text-gray-400">2025.03.29</p>
                </div>

                {/* 내 답변 */}
                <div
                  className="bg-white rounded p-4 shadow-sm border border-gray-200 mb-3 min-h-[200px] cursor-pointer"
                  onClick={() => {
                    if (!isEditing) {
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
                  <div className="bg-white rounded p-4 shadow-sm border border-gray-200 mb-3 min-h-[200px]">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {otherNickname}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {otherAnswer?.content ?? "아직 작성하지 않았어요."}
                    </p>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {currentStep === questions.length - 1 && !isEditing && isAllQuestionsAnswered() && (
          <div className="flex justify-center mt-4">
            <button
              className="px-6 py-2 bg-[#C67B5A] text-white text-sm font-GanwonEduAll_Bold rounded-md"
              onClick={handleSubmit}
            >
              제출하기
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SurveyPage;

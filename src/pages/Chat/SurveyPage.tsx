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
  const [tempAnswers, setTempAnswers] = useState<{ [key: number]: string }>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<number | null>(() => {
    const saved = localStorage.getItem(`chatRoomId_${roomId}`);
    return saved ? parseInt(saved) : null;
  });
  const [isSubmitted, setIsSubmitted] = useState(() => {
    const saved = localStorage.getItem(`isSubmitted_${roomId}`);
    return saved === 'true';
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const myId = user1Id;

  // chatRoomId가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (chatRoomId) {
      localStorage.setItem(`chatRoomId_${roomId}`, chatRoomId.toString());
    }
  }, [chatRoomId, roomId]);

  // isSubmitted가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(`isSubmitted_${roomId}`, isSubmitted.toString());
  }, [isSubmitted, roomId]);

  useEffect(() => {
    if (!state?.roomId) {
      console.error('방 정보가 없습니다.');
      navigate('/ChatList');
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
          setChatRoomId(data.roomId);
          setShowCompleteModal(true);
        });

        // 설문 퇴장 알림 구독
        stompClient.subscribe(`/topic/survey/${state.roomId}/leave`, (message) => {
          const data = JSON.parse(message.body);
          console.log('[❌ 설문 퇴장 알림 수신]', {
            destination: `/topic/survey/${state.roomId}/leave`,
            data,
          });
          alert(`${data.leaverNickname}님이 설문을 나갔습니다.`);
          navigate('/ChatList');
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
          .reduce((acc: { [key: number]: string }, curr: Answer) => {
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
      navigate('/ChatList');
    } else {
      navigate('/ChatList');
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

      const answersToSubmit = Object.entries(tempAnswers).map(([questionId, content]) => ({
        questionId: parseInt(questionId),
        content: content
      }));

      console.log('제출할 답변:', answersToSubmit);

      await axios.post(
        `https://www.mannamdeliveries.link/survey/${state.roomId}/answers/${myId}`,
        answersToSubmit
      );

      console.log('설문 제출 성공');
      setShowSubmitModal(false);
      setIsSubmitted(true); // ✅ 제출 완료로 표시
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

  const handleJoinChat = () => {
    if (chatRoomId) {
      navigate(`/chat/${chatRoomId}`);
    }
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
              navigate('/ChatList');
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

        {currentStep === questions.length - 1 && !isEditing && isAllQuestionsAnswered() && !isSubmitted && (
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
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-md">
            <h3 className="text-lg font-GanwonEduAll_Bold mb-4">제출 확인</h3>
            <p className="text-sm mb-6">제출 후에는 답변을 수정할 수 없습니다. 정말 제출하시겠습니까?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => setShowSubmitModal(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-[#C67B5A] text-white text-sm rounded"
                onClick={handleSubmit}
              >
                제출하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 설문 완료 모달 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-md">
            <h3 className="text-lg font-GanwonEduAll_Bold mb-4">설문 완료!</h3>
            <p className="text-sm mb-6">둘 다 모든 설문에 답변했어요!</p>
            <div className="flex justify-center">
              <button
                className="px-6 py-2 bg-[#C67B5A] text-white text-sm rounded"
                onClick={() => setShowCompleteModal(false)}
              >
                답변 확인하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 채팅방 참가 버튼 */}
      {chatRoomId && !showCompleteModal && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <button
            className="px-6 py-3 bg-[#C67B5A] text-white text-sm font-GanwonEduAll_Bold rounded-full shadow-lg"
            onClick={handleJoinChat}
          >
            채팅방 참가하기
          </button>
        </div>
      )}
    </>
  );
}

export default SurveyPage;

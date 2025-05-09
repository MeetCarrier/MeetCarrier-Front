import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import stamp from "../../assets/img/stamp.svg";
import bell_default from "../../assets/img/icons/NavIcon/bell_default.svg";
import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

import NavBar from "../../components/NavBar";
import FootPrintCheck from "./components/FootPrintCheck";

interface Question {
  questionId: number;
  content: string;
}

interface Answer {
  content: string;
  questionId: number;
  userId: number;
}

function SurveyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user1Id, user1Nickname, user2Id, user2Nickname } =
    location.state || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    fetch("/survey_questions.json")
      .then((res) => res.json())
      .then(setQuestions)
      .catch(console.error);

    fetch("/survey_answers.json")
      .then((res) => res.json())
      .then(setAnswers)
      .catch(console.error);
  }, []);

  const handleBackClick = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
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
          src={bell_default}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="w-full h-[calc(100%-200px)] px-4 z-0 font-GanwonEduAll_Light">
        <FootPrintCheck currentStep={currentStep + 1} />

        <Swiper
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={true}
          onSlideChange={(swiper) => setCurrentStep(swiper.activeIndex)}
          className="py-6"
        >
          {questions.map((question, index) => {
            const user1Answer = answers.find(
              (a) =>
                a.questionId === question.questionId && a.userId === user1Id
            );
            const user2Answer = answers.find(
              (a) =>
                a.questionId === question.questionId && a.userId === user2Id
            );

            const label = getLabeledQuestionTitle(index, questions.length);

            return (
              <SwiperSlide key={question.questionId}>
                <div>
                  {/* 질문 내용 */}
                  <p className="text-md font-GanwonEduAll_Bold my-2 text-[#333]">
                    {question.content}
                  </p>

                  {/* 질문 라벨 박스 */}
                  <div className="flex items-center text-sm text-[#333] font-GanwonEduAll_Bold mb-1">
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
                            className="border border-[#BD4B2C] px-2 py-[4px] mx-[1px]"
                          >
                            {char}
                          </span>
                        )
                      )}
                  </div>

                  <p className="text-xs text-gray-400 mb-4">2025.03.29</p>

                  {/* 유저 1 답변 */}
                  <div className="bg-white rounded p-4 shadow-sm border border-gray-200 mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {user1Nickname ?? `사용자 ${user1Id}`}
                      </p>
                      <p className="text-xs text-[#C67B5A] underline underline-offset-2 cursor-pointer">
                        작성 재촉하기
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {user1Answer?.content ?? "아직 작성하지 않았어요."}
                    </p>
                  </div>

                  {/* 유저 2 답변 */}
                  <div className="bg-white rounded p-4 shadow-sm border border-gray-200 mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {user2Nickname ?? `사용자 ${user2Id}`}
                      </p>
                      <p className="text-xs text-[#C67B5A] underline underline-offset-2 cursor-pointer">
                        작성 재촉하기
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {user2Answer?.content ?? "아직 작성하지 않았어요."}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {currentStep === questions.length - 1 && (
          <div className="flex justify-center mt-4">
            <button
              className="px-6 py-2 bg-[#C67B5A] text-white text-sm font-GanwonEduAll_Bold rounded-md"
              onClick={() => alert("모든 질문이 완료되었습니다!")}
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

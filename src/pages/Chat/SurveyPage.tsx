import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import stamp from "../../assets/img/stamp.svg";
import bell_default from "../../assets/img/icons/NavIcon/bell_default.svg";
import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

import NavBar from "../../components/NavBar";
import FootPrintCheck from "./components/FootPrintCheck";

const questions = [
  "죽기 전에 꼭 해보고 싶은 버킷리스트 한 가지와 이유는?",
  "가장 최근에 울었던 이유는 무엇인가요?",
  "내가 생각하는 나의 가장 큰 장점은 무엇인가요?",
  "스트레스를 해소하는 나만의 방법은?",
  "나를 가장 웃게 만든 순간은 언제인가요?",
];

function SurveyPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleBackClick = () => {
    if (currentStep === 0) navigate("/?modal=true");
    else setCurrentStep((prev) => prev - 1);
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
          {questions.map((question, index) => (
            <SwiperSlide key={index}>
              <div className="h-[calc(100%-400px)]">
                <p className="text-sm text-[#BD4B2C] font-GanwonEduAll_Bold mb-1">
                  {index + 1 === 1
                    ? "첫번째 질문"
                    : index + 1 === 2
                    ? "두번째 질문"
                    : index + 1 === 3
                    ? "세번째 질문"
                    : index + 1 === 4
                    ? "네번째 질문"
                    : "다섯번째 질문"}
                </p>
                <p className="text-md font-GanwonEduAll_Bold my-2 text-[#333]">
                  {question}
                </p>
                <p className="text-xs text-gray-400 mb-4">2025.03.29</p>
                <div className="bg-white rounded p-4 shadow-sm border border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">
                    밥만 잘먹더라
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    이곳을 눌러 떠오르는 생각을 남겨보세요.
                    <br />
                    친구는 답변을 통해 당신을 알아가게 될 거예요.
                  </p>
                </div>

                <div className="bg-white rounded p-4 shadow-sm border border-gray-200 mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-gray-800">
                      우민준
                    </p>
                    <p className="text-xs text-[#C67B5A] underline underline-offset-2 cursor-pointer">
                      작성 재촉하기
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    아직 작성하지 않았어요.
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
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

import { useNavigate } from "react-router-dom";
import { ChevronLeft, MoreVertical } from "lucide-react";
import stamp from "../../assets/img/stamp.svg"; // 발자국 스탬프
import bell_default from "../../assets/img/icons/NavIcon/bell_default.svg";
import check_icon from "../../assets/img/icons/HobbyIcon/check.svg";
import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

import NavBar from "../../components/NavBar";
import FootPrintCheck from "./components/FootPrintCheck";

function SurveyPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/?modal=true");
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
          onClick={handleBackClick}
        />
      </div>
      <div className="flex flex-col w-full h-[calc(100%-200px)] p-4 z-0 bg-[#F2F2F2]">
        {/* 메인 컨텐츠 영역 */}
        {/* 발자국 스탬프 컴포넌트 */}
        <FootPrintCheck currentStep={1} />

        {/* 질문 박스 */}
        <div className="px-6 text-center space-y-1 mb-6">
          <p className="text-sm text-gray-400">첫 번째 질문</p>
          <p className="text-md font-semibold">
            죽기 전에 꼭 해보고 싶은 버킷리스트 한 가지와 이유는?
          </p>
          <p className="text-xs text-gray-400">2025.03.29</p>
        </div>

        {/* 답변 영역 */}
        <div className="px-6 space-y-4">
          {/* 내 답변 */}
          <div className="bg-white rounded p-4 shadow-sm border border-gray-200">
            <p className="text-sm font-semibold text-gray-800">밥만 잘먹더라</p>
            <p className="text-xs text-gray-500 mt-1">
              이곳을 눌러 떠오르는 생각을 남겨보세요.
              <br />
              친구는 답변을 통해 당신을 알아가게 될 거예요.
            </p>
          </div>

          {/* 상대 답변 */}
          <div className="bg-white rounded p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-semibold text-gray-800">우민준</p>
              <p className="text-xs text-[#C67B5A] underline underline-offset-2 cursor-pointer">
                작성 재촉하기
              </p>
            </div>
            <p className="text-xs text-gray-400">아직 작성하지 않았어요.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SurveyPage;

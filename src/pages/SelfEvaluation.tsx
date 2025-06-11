import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Utils/hooks';
import { formatDate } from '../Utils/FormatDate';
import NavBar from '../components/NavBar';
import back_arrow from '../assets/img/icons/HobbyIcon/back_arrow.svg';
import btn1 from '../assets/img/button/btn1.webp';
import character_eva from '../assets/img/character/MeetCarrier_character_eva.svg';
import { resetTest } from '../Utils/testSlice';

function SelfEvaluation() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 설정에서 들어갈 때는 바꿔야 함.
  const handleBackClick = () => {
    navigate(-1);
  };

  const handlebtn1Click = () => {
    dispatch(resetTest());
    navigate('/Test');
  };

  const selfTestList = useAppSelector((state) => state.selfTest.list);

  const latestTestDate =
    selfTestList.length > 0
      ? formatDate(new Date(selfTestList[0].createdAt))
      : null;

  return (
    <>
      <NavBar />

      <div className="w-[80%] max-w-md flex flex-col items-center space-y-3 mb-4">
        {/* 친구 찾기 버튼 */}
        <button className="relative w-full max-w-md" onClick={handlebtn1Click}>
          <img src={btn1} alt="버튼1" className="w-full" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
            테스트 시작하기
          </span>
        </button>
        <p className="font-GanwonEduAll_Light text-sm text-[#333333] mb-3">
          {latestTestDate
            ? `가장 최근 ${latestTestDate}에 시행했어요!`
            : "아직 '자기 평가 테스트'를 하지 않았어요!"}
        </p>
      </div>

      {/* 캐릭터 */}
      <div className="relative w-[309px] h-[253px]">
        <img
          src={character_eva}
          alt="캐릭터"
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* 타이틀 영역 */}
      <div className="text-center mt-2">
        <p className="text-[40px] font-GanwonEduAll_Bold text-[#333333] leading-tight">
          나는 지금 <br />
          <span className="text-[#BD4B2C]">어떤 상태</span>일까?
        </p>
        <p className="text-[12px] text-[#333333]/80 mt-1 mb-4">
          #자기효능감 #대인관계능력 #우울감
        </p>
      </div>

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">
          자기 평가 테스트
        </p>
      </div>
    </>
  );
}

export default SelfEvaluation;

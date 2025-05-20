import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import questionmark_icon from '../../assets/img/icons/Dairy/questionmark_icon.svg';
import btn1 from '../../assets/img/button/btn1.webp';
import back_arrow from '../../assets/img/icons/HobbyIcon/back_arrow.svg';
import axios from 'axios';

function Dairy() {
  const [text, setText] = useState('');
  const maxLength = 100;

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/Calendar');
  };

  // 한글은 글자제한을 받지 않는 문제 해결
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
    } else {
      setText(value.slice(0, maxLength));
    }
  };

  // 일기 등록 <- 미완
  const handleDiaryRegister = async () => {
    try {
      await axios.patch('https://www.mannamdeliveries.link/journals/register', {
        withCredentials: true,
      });
      alert('저장 완료!');
    } catch (error) {
      console.error('저장 실패', error);
      alert('저장에 실패했어요.');
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
        <p className="text-[20px] font-MuseumClassic_L italic">
          칭찬 일기 작성하기
        </p>
        <img
          src={questionmark_icon}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>

      <div className="flex flex-col w-full h-[calc(100%-200px)] px-4">
        <div className="flex justify-center mb-3">
          <div className="w-[200px] h-[60px] bg-white" />
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <div className="text-left mb-3">
            <p className="text-[16px] font-semibold">오늘의 나를 칭찬하자면?</p>
            <p className="text-[14px] text-[#999]">2025.03.29</p>
          </div>

          {/* textarea가 나머지 공간 전부 차지 */}
          <textarea
            value={text}
            onInput={handleInput}
            placeholder="입력해주세요..."
            className="w-full flex-1 p-3 rounded-t-[10px] resize-none text-[14px] bg-white focus:outline-none"
          />
          <div className="text-right text-[12px] text-[#999] rounded-b-[10px] bg-white p-3 mb-4">
            {text.length} / 100
          </div>

          {/* 버튼 */}
          <button
            className="relative w-full mb-3"
            onClick={handleDiaryRegister}
          >
            <img src={btn1} alt="버튼1" className="w-full" />
            <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
              다음
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Dairy;

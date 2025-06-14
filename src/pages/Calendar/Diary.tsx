import { useAppDispatch, useAppSelector } from '../../Utils/hooks';
import { setText } from '../../Utils/diarySlice';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import questionmark_icon from '../../assets/img/icons/Dairy/questionmark_icon.svg';
import btn1 from '../../assets/img/button/btn1.webp';
import back_arrow from '../../assets/img/icons/HobbyIcon/back_arrow.svg';
import pen1_icon from '../../assets/img/icons/Calendar/pen1_icon.webp';

function Dairy() {
  const text = useAppSelector((state) => state.diary.text);
  const dateLabel = useAppSelector((state) => state.diary.dateLabel);
  const dispatch = useAppDispatch();
  const maxLength = 500;

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/Calendar');
  };

  const handleBtnClick = () => {
    navigate('/Stamp');
  };

  // 한글은 글자제한을 받지 않는 문제 해결
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      dispatch(setText(value));
    } else {
      dispatch(setText(value.slice(0, maxLength)));
    }
  };

  const placeholderText = `
  꾸준히 칭찬 일기를 쓰면 자신의 긍정적인 면에 집중하게 되어 있는 그대로 긍정하는 자기 긍정감이 커져요


(예시)
“더 자고 싶었지만 꾹 참고 일어나서 지각 안 했어!”
“오늘은 하루 종일 나를 위해 푹 쉬었어, 내일부터 힘내자!”
  `.trim();

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
          alt="questionmark_icon"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>

      <div className="flex flex-col w-full h-[calc(100%-200px)] px-4">
        <div className="flex justify-center mb-3">
          <div className="flex w-[200px] h-[60px] justify-center items-center">
            <img src={pen1_icon} alt="pen_icon" className="w-[60px] h-[25px]" />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col flex-1">
          <div className="mb-3">
            <p className="text-[18px] font-GanwonEduAll_Bold text-center">
              오늘의 나를 칭찬하자면?
            </p>
            <p className="text-[14px] font-GanwonEduAll_Light text-right text-[#333333]/50">
              {dateLabel}
            </p>
          </div>

          {/* textarea가 나머지 공간 전부 차지 */}
          <textarea
            value={text}
            onInput={handleInput}
            placeholder={placeholderText}
            className="w-full flex-1 p-3 rounded-t-[10px] resize-none text-[14px] bg-white focus:outline-none"
          />
          <div className="text-right text-[12px] text-[#333333]/50 rounded-b-[10px] bg-white p-3 mb-4">
            {text.length} / 500
          </div>

          {/* 버튼 */}
          <button className="relative w-full mb-3" onClick={handleBtnClick}>
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

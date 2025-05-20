import NavBar from '../../components/NavBar';
import calendar_icon from '../../assets/img/icons/Calendar/ic_calendar.svg';
import comming_dage from '../../assets/img/calendar/comming_date.svg';
import dairy_button from '../../assets/img/calendar/dairy.svg';
import today_check from '../../assets/img/calendar/today_check.svg';
import calendar_base from '../../assets/img/calendar/Calendar_base.png';
import { useNavigate } from 'react-router-dom';

const today = new Date();

// month 0 부터 시작임, 일단 기본 값을 넣음.. 나중에 수정
function CalendarGrid() {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const startDay = new Date(currentYear, currentMonth, 1).getDay(); // 0: 일, 6: 토
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate(); // 해당 월의 마지막 날짜

  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = i - startDay + 1;
    return date > 0 && date <= totalDays ? date : '';
  });

  return (
    <div
      className="w-[95%] aspect-[349/416] mx-auto flex flex-col bg-no-repeat bg-contain bg-center"
      style={{
        backgroundImage: `url(${calendar_base})`,
      }}
    >
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center items-center font-GanwonEduAll_Bold text-base font-semibold h-[7%]">
        {weekdays.map((day, i) => (
          <div
            key={i}
            className={`${i === 0 || i === 6 ? 'text-red-500' : 'text-[#333]'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 h-[15.5%]">
        {cells.map((day, i) => (
          <div
            key={i}
            className="relative flex text-left text-xs p-2 text-black/50 font-MuseumClassic_L"
          >
            {day && (
              <>
                <span>{day}</span>
                {day === currentDate && (
                  <img
                    src={today_check}
                    alt="today"
                    className="absolute left-[6px] w-[15px] h-[15px]"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Calendar() {
  const navigate = useNavigate();

  const handleDiaryClick = () => {
    navigate('/Diary');
  };

  return (
    <>
      <NavBar />

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 일지</p>
        <img
          src={calendar_icon}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>
      <div className="flex flex-col w-full h-[calc(100%-170px)] overflow-y-auto px-4 z-0 text-center">
        <div className="mb-1">
          <h2 className="text-2xl font-MuseumClassic_B">
            {today.getMonth() + 1}
          </h2>
          <p className="text-sm font-MuseumClassic_L italic text-[#333333]/50">
            {today.getFullYear()}
          </p>
        </div>
        <CalendarGrid />
        <div className="flex w-[95%] h-[25%] mx-auto mt-2 items-center justify-between">
          <div
            className="w-[210px] h-[100px] bg-no-repeat bg-contain bg-center relative flex flex-col items-center justify-center"
            style={{ backgroundImage: `url(${comming_dage})` }}
          >
            <p className="absolute top-2 left-1 text-xs font-GanwonEduAll_Bold text-[#333333]">
              다가오는 만남
            </p>
            <p className="text-[15px] font-GanwonEduAll_Bold text-[#333333]/50">
              D-5
            </p>
            <p className="text-[15px] font-GanwonEduAll_Bold text-[#333333]/50">
              이땃쥐돌이
            </p>
          </div>
          <button onClick={handleDiaryClick} className="cursor-pointer">
            <img src={dairy_button} alt="일기 등록" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Calendar;

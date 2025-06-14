import NavBar from '../../components/NavBar';
import calendar_icon from '../../assets/img/icons/Calendar/ic_calendar.svg';
import comming_dage from '../../assets/img/calendar/comming_date.webp';
import dairy_button from '../../assets/img/calendar/dairy.webp';
import today_check from '../../assets/img/calendar/today_check.svg';
import calendar_base from '../../assets/img/calendar/Calendar_base.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../Utils/hooks';
import { formatDate } from '../../Utils/FormatDate';
import {
  setText,
  setSelectedStamp,
  setIsEditingToday,
  setJournalId,
  setDateLabel,
} from '../../Utils/diarySlice';
import { stampMap } from '../../Utils/StampMap';
import axios from 'axios';

const today = new Date();

interface Journals {
  id: number;
  content: string;
  createdAt: string;
  stamp: string;
}

interface Meeting {
  id: number;
  date: string;
  location: string;
  note: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  nickname: string;
}

// month 0 부터 시작임, 일단 기본 값을 넣음.. 나중에 수정
function CalendarGrid({
  year,
  month,
  journals,
}: {
  year: number;
  month: number;
  journals: Journals[];
}) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const startDay = new Date(year, month, 1).getDay(); // 0: 일, 6: 토
  const totalDays = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleStampClick = (journal: Journals) => {
    const created = new Date(journal.createdAt);
    dispatch(setDateLabel(formatDate(created)));

    const isToday =
      created.getFullYear() === currentYear &&
      created.getMonth() === currentMonth &&
      created.getDate() === currentDate;

    dispatch(setJournalId(journal.id));
    dispatch(setText(journal.content));
    dispatch(setSelectedStamp(parseInt(journal.stamp)));

    if (isToday) {
      dispatch(setIsEditingToday(true));
    } else {
      dispatch(setIsEditingToday(false));
    }

    navigate('/ViewDiary');
  };

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
        {cells.map((day, i) => {
          const journalForDay = journals.find((j) => {
            const created = new Date(j.createdAt);
            return (
              created.getFullYear() === year &&
              created.getMonth() === month &&
              created.getDate() === day
            );
          });

          return (
            <div
              key={i}
              className="relative flex text-left text-xs p-2 text-black/50 font-MuseumClassic_L"
            >
              {day && (
                <>
                  <span>{day}</span>
                  {day === currentDate &&
                    year === currentYear &&
                    month === currentMonth && (
                      <img
                        src={today_check}
                        alt="today"
                        className="absolute left-[6px] w-[15px] h-[15px]"
                      />
                    )}
                  {journalForDay && (
                    <img
                      src={stampMap[parseInt(journalForDay.stamp) ?? 1]}
                      alt="스탬프"
                      className="absolute top-1/2 left-1/2 h-[60%] -translate-x-1/2 -translate-y-1/4 cursor-pointer"
                      onClick={() => handleStampClick(journalForDay)}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Calendar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showSelector, setShowSelector] = useState(false);
  const [showYearList, setShowYearList] = useState(false);
  const [showMonthList, setShowMonthList] = useState(false);
  const [journals, setJournals] = useState<Journals[]>([]);
  const [upcomingMeeting, setUpcomingMeeting] = useState<{
    nickname: string;
    dday: number;
  } | null>(null);

  useEffect(() => {
    const fetchJournalList = async () => {
      try {
        const monthFix = month + 1;
        console.log(year, monthFix);

        const res = await axios.get(
          `https://www.mannamdeliveries.link/api/journals/${year}/${monthFix}`,
          {
            withCredentials: true,
          }
        );

        console.log('이번 달 일기 목록:', res.data);
        setJournals(res.data);
      } catch (err) {
        console.error('일기 목록 조회 실패:', err);
      }
    };

    fetchJournalList();
  }, [year, month]);

  useEffect(() => {
    const fetchUpcomingMeeting = async () => {
      try {
        const res = await axios.get<Meeting[]>(
          'https://www.mannamdeliveries.link/api/meetings',
          { withCredentials: true }
        );

        console.log('만남 일정', res.data);

        const now = new Date();

        const validMeetings = res.data
          .filter((m) => m.status === 'ACCEPTED')
          .map((m) => ({
            ...m,
            dateObj: new Date(m.date),
          }))
          .filter((m) => m.dateObj.getTime() >= now.getTime()); // ⬅️ 시간이 지난 약속 제거

        if (validMeetings.length === 0) return;

        const nextMeeting = validMeetings.sort(
          (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
        )[0];

        // 날짜 기준 D-day 계산
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const meetingDayStart = new Date(
          nextMeeting.dateObj.getFullYear(),
          nextMeeting.dateObj.getMonth(),
          nextMeeting.dateObj.getDate()
        );

        const diffTime = meetingDayStart.getTime() - todayStart.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setUpcomingMeeting({
          nickname: nextMeeting.nickname,
          dday: diffDays,
        });
      } catch (error) {
        console.error('다가오는 약속 조회 실패:', error);
      }
    };
    fetchUpcomingMeeting();
  }, []);

  const currentYear = today.getFullYear();

  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleDiaryClick = () => {
    const todayJournal = journals.find((j) => {
      const created = new Date(j.createdAt);
      return (
        created.getFullYear() === today.getFullYear() &&
        created.getMonth() === today.getMonth() &&
        created.getDate() === today.getDate()
      );
    });

    dispatch(setDateLabel(formatDate(today)));

    if (todayJournal) {
      // 오늘 일기가 이미 존재할 경우: 수정 가능 모드로 열기
      dispatch(setJournalId(todayJournal.id));
      dispatch(setText(todayJournal.content));
      dispatch(setSelectedStamp(parseInt(todayJournal.stamp)));
      dispatch(setIsEditingToday(true));
      navigate('/ViewDiary');
    } else {
      dispatch(setText(''));
      dispatch(setSelectedStamp(null));
      dispatch(setIsEditingToday(false));
      navigate('/Diary');
    }
  };

  const toggleSelector = () => setShowSelector(!showSelector);

  const selectorRef = useRef<HTMLDivElement>(null);

  // 마우스 밖에 클릭하면 꺼짐
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(e.target as Node)
      ) {
        setShowYearList(false);
        setShowMonthList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <NavBar />

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 일지</p>
        <img
          src={calendar_icon}
          alt="calendar_icon"
          onClick={toggleSelector}
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
        {showSelector && (
          <div
            ref={selectorRef}
            className="absolute top-[110%] right-4 bg-white shadow-lg border rounded-md z-50 p-3 text-sm w-[200px]"
          >
            <div className="flex gap-2">
              {/* 연도 선택 */}
              <div className="relative w-full">
                <button
                  className="w-full border rounded px-2 py-1 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => {
                    setShowYearList((prev) => !prev);
                    setShowMonthList(false);
                  }}
                >
                  <span>{year}년</span>
                  <svg
                    className="w-4 h-4 text-gray-500 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showYearList && (
                  <ul className="absolute top-full left-0 mt-1 w-full max-h-[150px] overflow-y-auto bg-white border shadow rounded z-50">
                    {years.map((y) => (
                      <li
                        key={y}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setYear(y);
                          setShowYearList(false);
                        }}
                      >
                        {y}년
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 월 선택 */}
              <div className="relative w-full">
                <button
                  className="w-full border rounded px-2 py-1 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => {
                    setShowMonthList((prev) => !prev);
                    setShowYearList(false);
                  }}
                >
                  <span>{month + 1}월</span>
                  <svg
                    className="w-4 h-4 text-gray-500 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMonthList && (
                  <ul className="absolute top-full left-0 mt-1 w-full max-h-[150px] overflow-y-auto bg-white border shadow rounded z-50">
                    {months.map((m) => (
                      <li
                        key={m}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setMonth(m);
                          setShowMonthList(false);
                        }}
                      >
                        {m + 1}월
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowSelector(false)}
              className="block text-xs text-blue-500 mt-3 hover:underline mx-auto"
            >
              닫기
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full h-[calc(100%-170px)] overflow-y-auto px-4 z-0 text-center">
        <div className="mb-1">
          <h2 className="text-2xl font-MuseumClassic_B">{month + 1}</h2>
          <p className="text-sm font-MuseumClassic_L italic text-[#333333]/50">
            {year}
          </p>
        </div>
        <CalendarGrid year={year} month={month} journals={journals} />
        <div className="flex w-[95%] h-[25%] mx-auto mt-2 items-center justify-between">
          <div
            className="w-[210px] h-[100px] bg-no-repeat bg-contain bg-center relative flex flex-col items-center justify-center"
            style={{ backgroundImage: `url(${comming_dage})` }}
          >
            <p className="absolute top-2 left-1 text-xs font-GanwonEduAll_Bold text-[#333333]">
              다가오는 만남
            </p>
            <p className="text-[15px] font-GanwonEduAll_Bold text-[#333333]/50">
              {upcomingMeeting ? `D-${upcomingMeeting.dday}` : 'D-?'}
            </p>
            <p className="text-[15px] font-GanwonEduAll_Bold text-[#333333]/50">
              {upcomingMeeting?.nickname || '없음'}
            </p>
          </div>
          <button onClick={handleDiaryClick} className="cursor-pointer">
            <img
              src={dairy_button}
              alt="일기 등록"
              className="w-[60px] h-[60px]"
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default Calendar;

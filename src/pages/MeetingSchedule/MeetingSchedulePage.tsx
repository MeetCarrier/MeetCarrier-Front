import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMeetingSchedule } from "../../Utils/meetingScheduleSlice";

import NavBar from "../../components/NavBar";
import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

interface LocationState {
  senderName: string;
  recipientName: string;
  senderProfile: string;
  matchId: number;
  receiverId: number;
  roomId: number;
}

function MeetingSchedulePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    senderName,
    recipientName,
    senderProfile,
    matchId,
    receiverId,
    roomId,
  } = location.state as LocationState;

  const [date, setDate] = useState("");
  const [locationText, setLocationText] = useState("");
  const [memo, setMemo] = useState("");

  // 오늘 날짜와 한 달 후 날짜 계산
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(today.getMonth() + 1);

  // 날짜 형식을 YYYY-MM-DD로 변환
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // 날짜가 유효한지 확인
  const isValidDate = (selectedDate: string) => {
    const dateObj = new Date(selectedDate);
    return dateObj >= today && dateObj <= oneMonthLater;
  };

  // 저장 버튼 활성화 여부 확인
  const isFormValid = date && locationText && isValidDate(date);

  const handleSubmit = () => {
    if (!isFormValid) return;

    dispatch(
      setMeetingSchedule({
        matchId,
        receiverId,
        date,
        location: locationText,
        memo,
        isScheduled: true,
      })
    );

    navigate(`/chat/${roomId}`, {
      state: {
        senderName,
        recipientName,
        senderProfile,
        matchId,
        receiverId,
        roomId,
      },
    });
  };

  return (
    <>
      <NavBar />
      <div className="absolute top-[50px] z-50 text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">
          만남 일정 등록
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-132px)] mt-[50px] px-4">
        <div className="w-full max-w-[800px] p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              날짜
            </label>
            <input
              type="date"
              id="date"
              value={date}
              min={formatDate(today)}
              max={formatDate(oneMonthLater)}
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p className="text-sm text-gray-500 mt-1">
              * 한 달 이내의 날짜만 선택 가능합니다.
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              장소
            </label>
            <input
              type="text"
              id="location"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="예: 강남역 10번 출구 스벅"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="memo"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              메모
            </label>
            <textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="추가적인 메모 (예: 늦으면 미리 연락주세요)"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isFormValid
                ? "bg-[#D45A4B] hover:bg-[#bf4a3c] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            저장
          </button>
        </div>
      </div>
    </>
  );
}

export default MeetingSchedulePage;

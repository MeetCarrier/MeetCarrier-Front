import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Utils/store";
import { setMeetingSchedule } from "../../Utils/meetingScheduleSlice";

import NavBar from "../../components/NavBar";
import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

interface LocationState {
  matchId: number;
  receiverId: number;
  roomId: number;
}

function MeetingSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { matchId, receiverId, roomId } = location.state as LocationState;

  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");
  const [locationText, setLocationText] = useState("");

  const handleSubmit = () => {
    if (!date || !locationText) {
      alert("날짜와 장소를 모두 입력해주세요.");
      return;
    }

    // Redux에 일정 정보 저장
    dispatch(
      setMeetingSchedule({
        matchId,
        date,
        memo,
        location: locationText,
        isScheduled: true,
      })
    );

    alert("만남 일정이 등록되었습니다!");
    // 이전 페이지 (채팅방)으로 돌아가기
    navigate(`/chat/${roomId}`, {
      state: { matchId, receiverId, roomId },
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

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-132px)] mt-[50px] px-4">
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">만남 일정 등록</h2>

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
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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
            className="w-full bg-[#D45A4B] hover:bg-[#bf4a3c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            저장
          </button>
        </div>
      </div>
    </>
  );
}

export default MeetingSchedulePage;

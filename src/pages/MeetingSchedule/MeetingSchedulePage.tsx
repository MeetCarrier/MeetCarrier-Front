import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import NavBar from "../../components/NavBar";
import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

function MeetingSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId, isModify, meetingId } = location.state;

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

  // 기존 일정 조회
  useEffect(() => {
    const fetchMeetingInfo = async () => {
      if (!isModify || !matchId) return;

      try {
        console.log("[MeetingSchedulePage] 만남 일정 조회 요청:", {
          matchId,
        });
        const response = await axios.get(
          `https://www.mannamdeliveries.link/api/meetings/${matchId}`,
          { withCredentials: true }
        );
        console.log(
          "[MeetingSchedulePage] 만남 일정 조회 응답:",
          response.data
        );

        const meetingInfo = response.data;
        setDate(meetingInfo.date.split("T")[0]);
        setLocationText(meetingInfo.location);
        setMemo(meetingInfo.note);
      } catch (error) {
        console.error("[MeetingSchedulePage] 만남 일정 조회 실패:", error);
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          toast.error("더 이상 일정을 변경할 수 없습니다.");
          navigate(-1);
        }
      }
    };

    fetchMeetingInfo();
  }, [isModify, matchId, navigate]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const meetingData = {
        date: new Date(date).toISOString(),
        location: locationText,
        note: memo,
      };

      if (isModify && meetingId) {
        // 기존 일정 수정
        console.log("[MeetingSchedulePage] 만남 일정 수정 요청:", {
          meetingId,
          ...meetingData,
        });
        await axios.patch(
          `https://www.mannamdeliveries.link/api/meetings/${meetingId}`,
          meetingData,
          {
            withCredentials: true,
          }
        );
        console.log("[MeetingSchedulePage] 만남 일정 수정 완료");
      } else {
        // 새 일정 생성
        console.log("[MeetingSchedulePage] 만남 일정 생성 요청:", {
          matchId,
          ...meetingData,
        });
        await axios.post(
          `https://www.mannamdeliveries.link/api/meetings/${matchId}`,
          meetingData,
          {
            withCredentials: true,
          }
        );
        console.log("[MeetingSchedulePage] 만남 일정 생성 완료");
      }

      // 채팅방으로 돌아가기
      navigate(-1);
    } catch (error) {
      console.error("[MeetingSchedulePage] 만남 일정 등록/수정 실패:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          console.error(
            "[MeetingSchedulePage] 인증이 필요합니다. 로그인 페이지로 이동합니다."
          );
          navigate("/Login");
        } else if (error.response?.status === 409) {
          toast.error("더 이상 일정을 변경할 수 없습니다.");
        } else {
          console.error("[MeetingSchedulePage] 에러 상세:", {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config,
          });
        }
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="font-GanwonEduAll_Light w-full">
        <div className="font-GanwonEduAll_Light absolute top-[50px] z-50 text-[#333333] left-0 right-0 px-6 text-center">
          <img
            src={back_arrow}
            alt="back_arrow"
            className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <p className="text-[20px] font-MuseumClassic_L italic">
            {isModify ? "만남 일정 수정" : "만남 일정 등록"}
          </p>
        </div>

        <div className="font-GanwonEduAll_Light flex flex-col items-center justify-center w-full min-h-[calc(100vh-132px)] mt-[50px] px-4">
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
                className={`shadow appearance-none border  rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-gray-200 ${
                  date
                    ? "text-gray-800 font-semibold"
                    : "text-gray-400 font-normal"
                }`}
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-gray-200 ${
                  locationText
                    ? "text-gray-800 font-semibold"
                    : "text-gray-400 font-normal italic"
                }`}
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-gray-200 ${
                  memo
                    ? "text-gray-800 font-semibold"
                    : "text-gray-400 font-normal italic"
                }`}
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
              {isModify ? "수정하기" : "등록하기"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingSchedulePage;

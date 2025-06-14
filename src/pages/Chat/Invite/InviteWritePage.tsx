import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import letterBg from "../../../assets/img/icons/Letter/letterWrite.svg";
import NavBar from "../../../components/NavBar";
import back_arrow from "../../../assets/img/icons/HobbyIcon/back_arrow.svg";
import largeNextButton from "../../../assets/img/icons/Login/l_btn_fill.svg";

interface LocationState {
  senderName: string;
  recipientName: string;
  matchId: number;
  receiverId: number;
  roomId: number;
}

function InviteWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { senderName, recipientName, matchId, receiverId, roomId } =
    location.state as LocationState;

  //console.log("[InviteWritePage] Received location.state:", location.state);

  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      // 1. 초대장 전송
      console.log("[초대장 전송 요청]", {
        matchId,
        receiverId,
        message: message.trim(),
      });

      const response = await axios.post(
        "https://www.mannamdeliveries.link/api/invitation",
        {
          matchId,
          receiverId,
          message: message.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[초대장 전송 응답]", response.data);

      // 3. 채팅 페이지로 이동
      navigate(`/chat/${roomId}`, {
        state: {
          roomId: roomId,
        },
      });
    } catch (error) {
      console.error("[초대장 전송 실패]", error);
      if (axios.isAxiosError(error)) {
        console.error("서버 응답:", error.response?.data);
      }
      alert("초대장 전송에 실패했습니다.");
    }
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
        <p className="text-[20px] font-MuseumClassic_L italic">만남 배달부</p>
      </div>

      {/* 전송 버튼 */}
      <div className="fixed bottom-[90px] left-0 right-0 flex justify-center z-30">
        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className={`relative w-full max-w-[400px] h-[45px] flex items-center justify-center overflow-hidden transition-opacity duration-200 ${
            !message.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img
            src={largeNextButton}
            alt="대면 초대장 보내기"
            className="absolute inset-0 w-full h-full object-fill"
          />
          <span className="relative z-10 font-GanwonEduAll_Bold text-[#333]">
            대면 초대장 보내기
          </span>
        </button>
      </div>

      <div
        className="relative w-full max-w-[350px] h-[480px] bg-contain bg-no-repeat bg-center p-6"
        style={{ backgroundImage: `url(${letterBg})` }}
      >
        {/* To */}
        <div className="absolute top-13 left-6 flex items-center space-x-2 text-sm">
          <span>
            To. <strong>{recipientName}</strong>
          </span>
        </div>

        {/* 메시지 입력 필드 */}
        <textarea
          className="absolute top-20 left-6 right-6 bottom-16 resize-none bg-transparent outline-none text-sm"
          placeholder="내용을 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* From */}
        <p className="absolute bottom-14 right-6 text-sm text-right text-gray-600">
          From. <strong>{senderName}</strong>
        </p>
      </div>
    </>
  );
}

export default InviteWritePage;

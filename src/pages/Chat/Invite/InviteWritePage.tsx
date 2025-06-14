import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../Utils/store";
import toast from "react-hot-toast";
import letterBg from "../../../assets/img/icons/Letter/letterWrite.svg";
import NavBar from "../../../components/NavBar";
import back_arrow from "../../../assets/img/icons/HobbyIcon/back_arrow.svg";
import largeNextButton from "../../../assets/img/icons/Login/l_btn_fill.svg";
import smallNextButtonEmpty from "../../../assets/img/icons/Login/s_btn_empty.svg";
import smallNextButtonFill from "../../../assets/img/icons/Login/s_btn_fill.svg";

interface LocationState {
  senderName: string;
  recipientName: string;
  matchId: number;
  receiverId: number;
  roomId: number;
  myId?: number;
}

function InviteWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    senderName,
    recipientName,
    matchId,
    receiverId,
    roomId,
    myId: propMyId,
  } = location.state as LocationState;

  // Redux에서 사용자 정보 가져오기
  const user = useSelector((state: RootState) => state.user);
  const myId = propMyId || user?.userId;

  const [message, setMessage] = useState("");
  const [isInvitationExists, setIsInvitationExists] = useState(false);
  const [isReceiver, setIsReceiver] = useState(false);
  const [invitationId, setInvitationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("[InviteWritePage] 현재 사용자 ID:", myId);

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const res = await axios.get(
          `https://www.mannamdeliveries.link/api/invitation/${matchId}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const invitation = res.data;
          setMessage(invitation.message);
          setInvitationId(invitation.id);
          setIsInvitationExists(true);
          setIsReceiver(myId === invitation.receiverId);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setIsInvitationExists(false); // 초대장 없음 → 작성 모드
        } else {
          console.error("[초대장 확인 실패]", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkInvitation();
  }, [matchId, myId]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
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
      navigate(`/chat/${roomId}`, { state: { roomId } });
    } catch (error) {
      console.error("[초대장 전송 실패]", error);
      alert("초대장 전송에 실패했습니다.");
    }
  };

  const handleAccept = async () => {
    try {
      const response = await axios.patch(
        `https://www.mannamdeliveries.link/api/invitation/respond`,
        {
          matchId,
          accepted: true,
        },
        { withCredentials: true }
      );
      console.log("[초대장 수락 응답]", response.data);
      toast.success("초대장을 수락했습니다.");
      navigate(`/chat/${roomId}`, { state: { roomId } });
    } catch (error) {
      console.error("[초대장 수락 실패]", error);
      if (axios.isAxiosError(error)) {
        console.error("서버 응답:", error.response?.data);
        console.error("상태 코드:", error.response?.status);
      }
      toast.error("초대장 수락에 실패했습니다.");
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.patch(
        `https://www.mannamdeliveries.link/api/invitation/respond`,
        {
          matchId,
          accepted: false,
        },
        { withCredentials: true }
      );
      console.log("[초대장 거절 응답]", response.data);
      toast.success("초대장을 거절했습니다.");
      navigate(`/chat/${roomId}`, { state: { roomId } });
    } catch (error) {
      console.error("[초대장 거절 실패]", error);
      if (axios.isAxiosError(error)) {
        console.error("서버 응답:", error.response?.data);
        console.error("상태 코드:", error.response?.status);
      }
      toast.error("초대장 거절에 실패했습니다.");
    }
  };

  return (
    <>
      <NavBar />

      {/* 상단 헤더 */}
      <div className="absolute top-[50px] z-50 text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">만남 배달부</p>
      </div>

      {/* 초대장 본문 */}
      <div
        className="relative w-full max-w-[350px] h-[480px] bg-contain bg-no-repeat bg-center p-6 bottom-10"
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
          readOnly={isInvitationExists}
        />

        {/* From */}
        <p className="absolute bottom-14 right-6 text-sm text-right text-gray-600">
          From. <strong>{senderName}</strong>
        </p>
      </div>

      {/* 하단 버튼 */}
      {!loading && (
        <>
          {!isInvitationExists ? (
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
          ) : isReceiver ? (
            <div className="fixed bottom-[90px] left-0 right-0 flex justify-center gap-4 z-30 px-6 max-w-[400px] mx-auto">
              {/* 거절하기 버튼 - 회색 테두리 버튼 */}
              <button
                onClick={handleReject}
                className="relative w-1/2 h-[50px] flex items-center justify-center overflow-hidden"
              >
                <img
                  src={smallNextButtonEmpty}
                  alt="거절"
                  className="absolute inset-0 w-full h-full object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-[#333333] whitespace-nowrap">
                  거절하기
                </span>
              </button>

              {/* 수락하기 버튼 - 컬러 채운 버튼 */}
              <button
                onClick={handleAccept}
                className="relative w-1/2 h-[50px] flex items-center justify-center overflow-hidden"
              >
                <img
                  src={smallNextButtonFill}
                  alt="수락"
                  className="absolute inset-0 w-full h-full object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-white whitespace-nowrap">
                  수락하기
                </span>
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export default InviteWritePage;

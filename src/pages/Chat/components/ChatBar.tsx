import navbg from "../../../assets/img/nav_bg.webp";
import navbg2 from "../../../assets/img/nav_bg2.webp";
import { useState, useRef } from "react";

import ReportModal from "../../../components/ReportModal";
import InviteLetterModal from "../Invite/InviteLetterModal";
import EndModal from "../../../components/EndModal";

import plus_icon from "../../../assets/img/icons/ChatIcon/ic_plus.svg";
import arrow_icon from "../../../assets/img/icons/ChatIcon/ic_arrow.svg";
import face_icon from "../../../assets/img/icons/ChatIcon/ic_face.svg";
import questionmark_icon from "../../../assets/img/icons/ChatIcon/ic_questionmark.svg";
import album_icon from "../../../assets/img/icons/ChatIcon/ic_album.svg";
import invite_icon from "../../../assets/img/icons/ChatIcon/ic_invite.svg";
import end_icon from "../../../assets/img/icons/ChatIcon/ic_end.svg";
import report_icon from "../../../assets/img/icons/ChatIcon/ic_report.svg";
import survey_icon from "../../../assets/img/icons/ChatIcon/ic_survey.svg";
import imageCompression from "browser-image-compression";
import axios from "axios";

interface ChatBarProps {
  emojiOpen: boolean;
  onEmojiToggle: () => void;
  onSendMessage: (message: string, imageUrl?: string) => void;
  senderName: string;
  recipientName: string;
  senderProfile: string;
  onInviteClick: () => void;
  onSurveyClick: () => void;
  matchId: number;
  receiverId: number;
  roomId: number;
  onEndMeeting: () => void;
}

function ChatBar({
  onEmojiToggle,
  emojiOpen,
  onSendMessage,
  senderName = "나",
  recipientName = "상대방",
  senderProfile,
  onInviteClick,
  onSurveyClick,
  matchId,
  receiverId,
  roomId,
  onEndMeeting,
}: ChatBarProps) {
  const [message, setMessage] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const uploadImageAndSendMessage = async (file: File) => {
    const formData = new FormData();
    formData.append("multipartFile", file);

    try {
      console.log("이미지 서버 업로드 시작");
      const response = await axios.post(
        "https://www.mannamdeliveries.link/api/file/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("이미지 서버 업로드 성공:", response.data);
      const imageUrl = response.data;

      if (onSendMessage) {
        onSendMessage("이미지를 전송했습니다.", imageUrl);
      }
    } catch (error) {
      console.error("이미지 서버 업로드 실패:", error);
      if (axios.isAxiosError(error)) {
        console.error("서버 응답 내용:", error.response?.data);
        console.error("서버 응답 상태:", error.response?.status);
        console.error("서버 응답 헤더:", error.response?.headers);
      }
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검사: 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      if (e.target) {
        e.target.value = "";
      }
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
        alwaysKeepResolution: true,
        fileType: file.type,
      };

      console.log("이미지 압축 시작");
      const compressedFile = await imageCompression(file, options);
      console.log("압축된 파일 타입:", compressedFile.type);

      // 압축된 파일을 새로운 File 객체로 변환
      const finalFile = new File([compressedFile], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      uploadImageAndSendMessage(finalFile);
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error);
      alert("이미지 처리에 실패했습니다.");
    } finally {
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  return (
    <>
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          height: emojiOpen ? 200 : 0,
          backgroundImage: `url(${navbg2})`,
        }}
      >
        <div className="grid grid-cols-4 gap-y-4 px-6 pt-4">
          {[
            {
              icon: album_icon,
              label: "앨범",
              onClick: () => fileInputRef.current?.click(),
            },
            {
              icon: invite_icon,
              label: "대면초대장",
              onClick: () => setShowInviteModal(true),
            },
            {
              icon: end_icon,
              label: "만남종료",
              onClick: () => setShowEndModal(true),
            },
            {
              icon: report_icon,
              label: "신고",
              onClick: () => setShowReportModal(true),
            },
            {
              icon: survey_icon,
              label: "비대면설문지",
              onClick: onSurveyClick,
            },
          ].map(({ icon, label, onClick }, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full bg-[#722518] flex items-center justify-center cursor-pointer"
                onClick={onClick}
              >
                <img src={icon} alt={label} className="w-6 h-6" />
              </div>
              <span className="text-white text-xs mt-1 text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="w-full h-[82px] px-2 flex items-center"
        style={{ backgroundImage: `url(${navbg})` }}
      >
        <div className="flex items-center w-full gap-2">
          <button
            className="w-9 h-9 rounded-full bg-[#A34027] flex items-center justify-center flex-shrink-0"
            onClick={onEmojiToggle}
          >
            <img src={plus_icon} alt="plus" className="w-5 h-5" />
          </button>

          <div className="flex items-center flex-1 bg-[#A34027] rounded-full px-3 py-2">
            <input
              type="text"
              placeholder="전할 말 입력"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 bg-transparent text-white text-sm placeholder:text-white outline-none`}
            />
            <button>
              <img src={face_icon} alt="face" className="w-5 h-5 ml-2" />
            </button>
          </div>

          <button className="w-9 h-9 rounded-full bg-[#A34027] flex items-center justify-center flex-shrink-0">
            <img src={questionmark_icon} alt="?" className="w-5 h-5" />
          </button>

          <button
            onClick={handleSendMessage}
            className={`w-9 h-9 rounded-full bg-[#A34027] flex items-center justify-center flex-shrink-0 ${
              message.trim() ? "" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!message.trim()}
          >
            <img src={arrow_icon} alt="send" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="User"
        onSubmit={(reasons, content) => {
          alert(
            `신고가 접수되었습니다.\n사유: ${reasons.join(
              " / "
            )}\n내용: ${content}`
          );
        }}
      />

      <InviteLetterModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        senderName={senderName}
        recipientName={recipientName}
        senderProfile={senderProfile}
        matchId={matchId}
        receiverId={receiverId}
        roomId={roomId}
        onSubmit={() => {
          onInviteClick();
          setShowInviteModal(false);
        }}
      />

      <EndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onSubmit={async (reason) => {
          console.log("만남 종료 사유: ", reason);
          try {
            await axios.post(
              `https://www.mannamdeliveries.link/api/matches/${matchId}/end`,
              { reason },
              { withCredentials: true }
            );
            alert("만남 종료 사유가 전송되었습니다.");
            onEndMeeting();
          } catch (error) {
            console.error("만남 종료 요청 실패:", error);
            alert("만남 종료 요청에 실패했습니다.");
          }
          setShowEndModal(false);
        }}
      />
    </>
  );
}

export default ChatBar;

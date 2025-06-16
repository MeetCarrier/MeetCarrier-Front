import React from "react";
import { useNavigate } from "react-router-dom";
import stamp from "../../../assets/img/stamp.svg";
import sampleProfile from "../../../assets/img/sample/sample_profile.svg";
import largeNextButton from "../../../assets/img/icons/Login/l_btn_fill.svg";

interface ItemCardProps {
  profileImageUrl?: string;
  username: string;
  time: string;
  lastMessage?: string;
  showReviewButton?: boolean;
  onClickReview?: () => void;
  onProfileClick?: () => void;
  status?: string; // 추가
  onClick?: () => void; // 추가
  unreadCount?: number; // 안 읽은 메시지 개수
  userId?: string; // 추가
  hasWrittenReview?: boolean;
}

function formatMessageTime(messageDateStr: string): string {
  const now = new Date();
  const messageDate = new Date(messageDateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );
  const msDiff = today.getTime() - messageDay.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (msDiff === 0) {
    const hours = messageDate.getHours().toString().padStart(2, "0");
    const minutes = messageDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else if (msDiff === oneDay) {
    return "어제";
  } else {
    const year = messageDate.getFullYear();
    const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
    const day = messageDate.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  }
}

const ItemCard: React.FC<ItemCardProps> = ({
  profileImageUrl = sampleProfile,
  username,
  time,
  lastMessage,
  showReviewButton = false,
  onClickReview,
  onProfileClick,
  status,
  onClick,
  unreadCount = 0,
  userId,
  hasWrittenReview = false,
}) => {
  const navigate = useNavigate();
  const actualImageUrl = profileImageUrl || sampleProfile;

  //console.log("[ItemCard] unreadCount:", unreadCount);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClickReview) {
      onClickReview();
    } else if (userId) {
      navigate(`/review/${userId}`);
    }
  };

  return (
    <div className="flex flex-col bg-white p-2 mb-2" onClick={onClick}>
      <div className="flex justify-between items-center">
        {/* 왼쪽: 스탬프 + 프로필 */}
        <div className="flex items-center">
          <div
            className="relative w-12 h-12 mr-3 cursor-pointer"
            onClick={handleProfileClick}
          >
            <img
              src={stamp}
              alt="stamp"
              className="absolute inset-0 w-full h-full z-0"
            />
            <img
              src={actualImageUrl}
              alt="profile"
              className="absolute inset-1 w-10 h-10 object-cover z-10"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = sampleProfile;
              }}
            />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#BD4B2C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-GanwonEduAll_Bold z-20">
                {unreadCount > 99 ? "99+" : unreadCount}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-GanwonEduAll_Bold text-sm text-gray-800">
              {username}
            </p>
            {lastMessage && (
              <p className="text-xs text-gray-600 font-GanwonEduAll_Light truncate max-w-[200px]">
                {lastMessage}
              </p>
            )}
          </div>
        </div>

        {/* 오른쪽: 시간 또는 버튼 */}
        {showReviewButton ? (
          <button
            onClick={handleReviewClick}
            className="px-4 py-1 w-full text-sm bg-[#D9C6B4] text-white font-GanwonEduAll_Light rounded"
          >
            후기작성
          </button>
        ) : (
          <span className="text-xs font-GanwonEduAll_Light text-gray-400">
            {formatMessageTime(time)}
          </span>
        )}
      </div>

      {/* Survey_Cancelled 또는 Chat_Cancelled 상태일 때 하단에 후기 버튼 표시 */}
      {(status === "Survey_Cancelled" ||
        status === "Chat_Cancelled" ||
        status === "Reviewing" ||
        status === "Completed") && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={handleReviewClick}
            disabled={hasWrittenReview}
            className={`relative w-full max-w-[400px] h-[40px] flex items-center justify-center overflow-hidden transition-opacity duration-200 ${
              hasWrittenReview ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img
              src={largeNextButton}
              alt="후기작성"
              className="absolute inset-0 w-full h-full object-fill"
            />
            <span
              className={`relative z-10 font-GanwonEduAll_Light font-bold ${
                hasWrittenReview ? "text-black" : "text-white"
              }`}
            >
              {hasWrittenReview ? "이미 후기를 작성하셨어요" : "후기작성"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;

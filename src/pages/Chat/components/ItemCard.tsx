import React from "react";
import stamp from "../../../assets/img/stamp.svg";
import sampleProfile from "../../../assets/img/sample/sample_profile.svg";
import { fetchUserById } from "../../../Utils/api";

interface ItemCardProps {
  profileImageUrl?: string;
  username: string;
  time: string;
  lastMessage?: string;
  opponentId: number; // ✅ 추가
  showReviewButton?: boolean;
  onClickReview?: () => void;
  onProfileClick?: () => void;
  status?: string; // 추가
  onClick?: () => void; // 추가
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
  opponentId,
  showReviewButton = false,
  onClickReview,
  onProfileClick,
  status,
  onClick,
}) => {
  const actualImageUrl = profileImageUrl || sampleProfile;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (onProfileClick) {
      onProfileClick();
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
            onClick={onClickReview}
            className="px-4 py-1 text-sm bg-[#D9C6B4] text-white font-GanwonEduAll_Light rounded"
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
      {(status === "Survey_Cancelled" || status === "Chat_Cancelled") && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={onClickReview}
            className="px-4 py-1 text-sm bg-[#D9C6B4] text-white font-GanwonEduAll_Light rounded"
          >
            후기작성
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;

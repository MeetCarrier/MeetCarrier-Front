import React from "react";
import stamp from "../../../assets/img/stamp.svg";
import sampleProfile from "../../../assets/img/sample/sample_profile.svg";

interface ItemCardProps {
  profileImageUrl?: string;
  username: string;
  time: string;
  showReviewButton?: boolean;
  onClickReview?: () => void;
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
  showReviewButton = false,
  onClickReview,
}) => {
  return (
    <div className="flex justify-between items-center bg-white rounded-xl p-3 shadow mb-2">
      {/* 왼쪽: 스탬프 + 프로필 */}
      <div className="flex items-center">
        <div className="relative w-12 h-12 mr-3">
          <img
            src={stamp}
            alt="stamp"
            className="absolute inset-0 w-full h-full z-0"
          />
          <img
            src={profileImageUrl}
            alt="profile"
            className="absolute inset-1 w-10 h-10 object-cover rounded-md z-10"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = sampleProfile;
            }}
          />
        </div>
        <p className="font-GanwonEduAll_Bold text-sm text-gray-800">
          {username}
        </p>
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
  );
};

export default ItemCard;

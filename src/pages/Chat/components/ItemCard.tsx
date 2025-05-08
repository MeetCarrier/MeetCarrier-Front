import React from "react";
import stamp from "../../../assets/img/stamp.svg"; // stamp 배경
import sampleProfile from "../../../assets/img/sample/sample_profile.svg"; // 예시 프사

interface ItemCardProps {
  profileImageUrl?: string;
  username: string;
  time: string; // ISO 형식 날짜 문자열
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
    <div className="flex justify-between items-center bg-white px-4 py-3 ">
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
            className="absolute inset-1 w-[80%] h-[80%] object-cover rounded z-10 left-1 top-1"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{username}</p>
        </div>
      </div>

      {/* 오른쪽: 시간 또는 버튼 */}
      {showReviewButton ? (
        <button
          onClick={onClickReview}
          className="px-4 py-1 text-sm bg-[#D9C6B4] text-white rounded"
        >
          후기작성
        </button>
      ) : (
        <span className="text-xs text-gray-400">{formatMessageTime(time)}</span>
      )}
    </div>
  );
};

export default ItemCard;

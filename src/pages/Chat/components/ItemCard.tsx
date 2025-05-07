import React from "react";

interface ItemCardProps {
  profileImageUrl: string;
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
  profileImageUrl,
  username,
  time,
  showReviewButton = false,
  onClickReview,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center">
        <img
          src={profileImageUrl}
          alt="profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{username}</p>
          <p className="text-sm text-gray-500">{formatMessageTime(time)}</p>
        </div>
      </div>

      {showReviewButton && (
        <button
          onClick={onClickReview}
          className="px-4 py-1 text-sm bg-[#D9C6B4] text-white rounded"
        >
          후기작성
        </button>
      )}
    </div>
  );
};

export default ItemCard;

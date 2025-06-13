import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import peopleIcon from "../../assets/img/icons/Review/people.svg"; // 사람 아이콘 예시

type ReviewItem = {
  content: string;
  count: number;
};

interface ReviewListProps {
  reviews: ReviewItem[];
}

function ReviewList({ reviews }: ReviewListProps) {
  // 상위 3개 정렬
  const top3 = [...reviews].sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <div className="w-full bg-white rounded-xl px-5 py-4 shadow-sm">
      {/* 헤더 */}
      <div
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={() => alert("상세페이지로 이동 예정")}
      >
        <h2 className="text-[15px] font-GanwonEduAll_Bold text-[#333]">
          받은 후기
        </h2>
        <img
          src={arrowIcon}
          alt="arrow"
          className="w-[12px] h-[12px] transform scale-x-[-1]"
        />
      </div>

      {/* 후기 리스트 */}
      <div className="flex flex-col divide-y divide-[#f0f0f0]">
        {top3.map((review, idx) => (
          <div key={idx} className="flex items-center justify-between py-2">
            <span className="text-sm text-[#666666] font-GanwonEduAll_Light">
              "{review.content}"
            </span>
            <div className="flex items-center gap-1">
              <img
                src={peopleIcon}
                alt="사람 수"
                className="w-[14px] h-[14px]"
              />
              <span className="text-sm text-[#666666] font-GanwonEduAll_Light min-w-[20px] text-right pr-1">
                {review.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;

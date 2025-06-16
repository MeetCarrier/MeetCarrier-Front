import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import peopleIcon from "../../assets/img/icons/Review/people.svg"; // 사람 아이콘 예시
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type ReviewItem = {
  reviewId: number;
  rating: number;
  content: string;
  step: number;
  createdAt: string;
  reviewerId: number;
  reviewerName: string;
};

type ContentCount = {
  content: string;
  count: number;
};

function ReviewList() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [topContents, setTopContents] = useState<ContentCount[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "https://www.mannamdeliveries.link/api/review",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("리뷰 데이터:", response.data);

          // 모든 content를 분리하고 카운트
          const contentCounts: { [key: string]: number } = {};
          response.data.forEach((review: ReviewItem) => {
            const contents = review.content.split(",");
            contents.forEach((content) => {
              contentCounts[content] = (contentCounts[content] || 0) + 1;
            });
          });

          // 카운트 순서로 정렬하고 상위 3개 추출
          const sortedContents = Object.entries(contentCounts)
            .map(([content, count]) => ({ content, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          setTopContents(sortedContents);
        } else if (response.status === 204) {
          console.log("리뷰가 존재하지 않습니다.");
          setError("리뷰가 존재하지 않습니다.");
        }
      } catch (error) {
        console.error("리뷰를 불러올 수 없습니다:", error);
        setError("리뷰를 불러올 수 없습니다.");
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="w-full bg-white rounded-xl px-5 py-4 shadow-sm">
      {/* 헤더 */}
      <div
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={() => navigate("/ReviewDetail")}
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

      {/* 에러 메시지 */}
      {error && (
        <div className="text-sm text-[#666666] font-GanwonEduAll_Light text-center py-2">
          {error}
        </div>
      )}

      {/* 후기 리스트 */}
      {!error && (
        <div className="flex flex-col divide-y divide-[#f0f0f0]">
          {topContents.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-[#666666] font-GanwonEduAll_Light">
                "{item.content}"
              </span>
              <div className="flex items-center gap-1">
                <img
                  src={peopleIcon}
                  alt="사람 수"
                  className="w-[14px] h-[14px]"
                />
                <span className="text-sm text-[#666666] font-GanwonEduAll_Light min-w-[20px] text-right pr-1">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewList;

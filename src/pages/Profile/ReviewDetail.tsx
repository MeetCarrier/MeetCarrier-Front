import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar";
import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import peopleIcon from "../../assets/img/icons/Review/people.svg";

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

function ReviewDetail() {
  const navigate = useNavigate();
  const [contentCounts, setContentCounts] = useState<ContentCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    {
      title: "대화",
      tags: [
        { text: "대화가 자연스럽고 편안해요", icon: "💡" },
        { text: "경청하는 태도가 좋아요", icon: "👂" },
        { text: "존중을 잘해요", icon: "🤝" },
        { text: "잘 웃어줘요", icon: "😊" },
        { text: "대화 주제가 다양하고 흥미로워요", icon: "🧠" },
        { text: "답장이 빨라요", icon: "💨" },
      ],
    },
    {
      title: "태도",
      tags: [
        { text: "다정해요", icon: "🌸" },
        { text: "배려를 잘해요", icon: "🍃" },
        { text: "진심이 느껴졌어요", icon: "💛" },
        { text: "마음이 따뜻해요", icon: "☀️" },
      ],
    },
    {
      title: "관계",
      tags: [
        { text: "나와 잘 맞아요", icon: "🧩" },
        { text: "신뢰가 생겨요", icon: "✨" },
        { text: "시간이 짧게 느껴졌어요", icon: "⏱️" },
        { text: "다시 만나고 싶어요", icon: "🔄" },
      ],
    },
    {
      title: "기타",
      tags: [{ text: "선택할 키워드가 없어요", icon: "" }],
    },
  ];

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
          const counts: { [key: string]: number } = {};
          response.data.forEach((review: ReviewItem) => {
            const contents = review.content.split(",");
            contents.forEach((content) => {
              counts[content] = (counts[content] || 0) + 1;
            });
          });

          // 카운트 순서로 정렬
          const sortedContents = Object.entries(counts)
            .map(([content, count]) => ({ content, count }))
            .sort((a, b) => b.count - a.count);

          setContentCounts(sortedContents);
        } else if (response.status === 204) {
          setError("리뷰가 존재하지 않습니다.");
        }
      } catch (err) {
        console.error("리뷰 조회 실패:", err);
        setError("리뷰를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
      <NavBar />

      {/* Fixed Header */}
      <div className="fixed top-[50px] left-0 right-0 z-10 flex items-center justify-center h-[50px] px-5">
        <img
          src={arrowIcon}
          alt="arrowIcon"
          className="absolute left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="text-[20px] font-MuseumClassic_L italic text-[#333333]">
          받은 후기
        </p>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex flex-col items-start w-full mt-[100px] h-full overflow-y-auto">
        <div className="flex flex-col items-start w-[90%] max-w-md mx-auto py-4 space-y-4">
          {loading ? (
            <p className="text-[#999999] text-base">리뷰를 불러오는 중...</p>
          ) : error ? (
            <p className="text-red-500 text-base">{error}</p>
          ) : contentCounts.length === 0 ? (
            <p className="text-[#999999] text-base">
              아직 받은 리뷰가 없어요...
            </p>
          ) : (
            <div className="flex flex-col w-full space-y-4">
              {categories.map((category, categoryIdx) => {
                const filteredContentCounts = contentCounts.filter((item) =>
                  category.tags.some((tag) => tag.text === item.content)
                );

                if (filteredContentCounts.length === 0) {
                  return null;
                }

                return (
                  <div
                    key={categoryIdx}
                    className="flex flex-col w-full space-y-1 bg-white rounded-lg px-5 py-3"
                  >
                    <p className="text-lg font-semibold text-[#333333] font-GanwonEduAll_Light ">
                      {category.title}
                    </p>
                    {filteredContentCounts.map((item, reviewIdx) => {
                      const tagInfo = category.tags.find(
                        (tag) => tag.text === item.content
                      );
                      const icon = tagInfo ? tagInfo.icon : "";

                      return (
                        <div key={reviewIdx} className="w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-base text-[#666666] font-GanwonEduAll_Light flex items-center gap-1">
                              {icon && (
                                <span className="mr-1 w-[20px] inline-flex items-center justify-center">
                                  {icon}
                                </span>
                              )}
                              {item.content}
                            </span>
                            <div className="flex items-center gap-1">
                              <img
                                src={peopleIcon}
                                alt="사람 수"
                                className="w-[18px] h-[18px]"
                              />
                              <span className="text-base text-[#666666] font-GanwonEduAll_Light min-w-[10px] text-right">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ReviewDetail;

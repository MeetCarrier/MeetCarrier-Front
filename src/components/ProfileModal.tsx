import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import stampImage from "../assets/img/stamp.svg";
import defaultProfileImg from "../assets/img/sample/sample_profile.svg";
import peopleIcon from "../assets/img/icons/Review/people.svg";
import axios from "axios";

export type UserProfileData = {
  userId: number;
  nickname: string;
  imgUrl?: string | null;
  age?: number;
  gender?: string;
  footprint?: number;
  interests?: string;
  question?: string;
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData;
}

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

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { nickname, age, gender, footprint, imgUrl, interests, question } =
    user;
  const footprintGoal = 1000;
  const percentage = Math.min(((footprint ?? 0) / footprintGoal) * 100, 100);

  const profileImageUrl = imgUrl || defaultProfileImg;

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [contentCounts, setContentCounts] = useState<ContentCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
    if (!isOpen || !user.userId) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://www.mannamdeliveries.link/api/review/${user.userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("리뷰 데이터 (ProfileModal):", response.data);
          setReviews(response.data);

          const counts: { [key: string]: number } = {};
          response.data.forEach((review: ReviewItem) => {
            const contents = review.content.split(",");
            contents.forEach((content) => {
              counts[content.trim()] = (counts[content.trim()] || 0) + 1;
            });
          });

          const sortedContents = Object.entries(counts)
            .map(([content, count]) => ({ content, count }))
            .sort((a, b) => b.count - a.count);

          setContentCounts(sortedContents);
        } else if (response.status === 204) {
          setContentCounts([]);
        }
      } catch (err) {
        console.error("리뷰 조회 실패 (ProfileModal):", err);
        setError("리뷰를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isOpen, user.userId]);

  const displayedContentCounts = isExpanded
    ? contentCounts
    : contentCounts.slice(0, 3);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center w-full space-y-4 font-GanwonEduAll_Light">
        {/* 프로필 */}
        <div className="flex items-center gap-3 w-full">
          <div
            className="relative w-[50px] h-[50px]"
            style={{
              backgroundImage: `url(${stampImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <img
              src={profileImageUrl}
              alt="profile"
              className="absolute top-[6%] left-[6%] w-[88%] h-[88%] object-cover rounded-[2px]"
            />
          </div>

          <div className="flex flex-col text-left">
            <p className="text-[16px] text-[#333] font-GanwonEduAll_Bold">
              {nickname}
            </p>
            <p className="text-sm text-[#999999]">
              {age}세 · {gender === "Male" ? "남성" : "여성"}
            </p>
          </div>
        </div>

        <div className="w-full min-h-[450px] relative">
          {/* 상단 정보 및 3개 미리보기 후기 */}
          <div
            className={`
    absolute left-0 top-0 w-full
    transition-all duration-700 ease-in-out
    ${
      isExpanded
        ? "max-h-0 opacity-0 pointer-events-none"
        : "max-h-[1200px] opacity-100"
    }
  `}
            style={{ zIndex: 1 }}
          >
            {/* 상단 정보 */}
            <div className="space-y-3">
              <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3">
                <div className="flex justify-between text-sm text-[#666] mb-1">
                  <span>만남 발자국</span>
                  <span className="text-[#BD4B2C] font-GanwonEduAll_Bold">
                    {Math.floor(footprint ?? 0)}보
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#BD4B2C] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3">
                <p className="text-sm font-GanwonEduAll_Bold mb-2">관심사</p>
                {interests ? (
                  <p className="text-sm text-[#666] whitespace-pre-wrap">
                    {interests?.replace(/,/g, ", ")}
                  </p>
                ) : (
                  <p className="text-sm text-[#aaa]">관심사가 없습니다.</p>
                )}
              </div>
              <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3">
                <p className="text-sm font-GanwonEduAll_Bold mb-2">
                  친구에게 물어보고 싶은 질문
                </p>
                {question ? (
                  <p className="text-sm text-[#666] whitespace-pre-wrap">
                    "{question}"
                  </p>
                ) : (
                  <p className="text-sm text-[#aaa]">등록된 질문이 없습니다.</p>
                )}
              </div>
            </div>
            {/* 받은 후기 미리보기 (최대 3개) */}
            <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3 mt-3">
              <p className="text-sm font-GanwonEduAll_Bold mb-2">받은 후기</p>
              {loading ? (
                <p className="text-[#999999] text-sm">리뷰를 불러오는 중...</p>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : contentCounts.length === 0 ? (
                <p className="text-sm text-[#aaa]">아직 후기가 없어요.</p>
              ) : (
                <div className="flex flex-col w-full space-y-1 overflow-hidden">
                  {contentCounts.slice(0, 3).map((item, idx) => {
                    const tagInfo = categories
                      .flatMap((cat) => cat.tags)
                      .find((tag) => tag.text === item.content);
                    const icon = tagInfo ? tagInfo.icon : "";
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between w-full"
                      >
                        <span className="text-sm text-[#666666] font-GanwonEduAll_Light flex items-center gap-1">
                          {icon && (
                            <span className="mr-1 w-[18px] inline-flex items-center justify-center">
                              {icon}
                            </span>
                          )}
                          {item.content}
                        </span>
                        <div className="flex items-center gap-1">
                          <img
                            src={peopleIcon}
                            alt="사람 수"
                            className="w-[14px] h-[14px]"
                          />
                          <span className="text-sm text-[#666666] font-GanwonEduAll_Light min-w-[10px] text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {/* 더보기 버튼 */}
                  {contentCounts.length > 3 && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-[#BD4B2C] text-sm mt-2 w-full text-center font-GanwonEduAll_Bold"
                    >
                      더보기
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 전체 후기 목록 */}
          <div
            className={`
    absolute left-0 top-0 w-full
    transition-all duration-700 ease-in-out
    ${
      isExpanded
        ? "max-h-[1200px] opacity-100"
        : "max-h-0 opacity-0 pointer-events-none"
    }
  `}
            style={{ zIndex: 2 }}
          >
            <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3 mt-3">
              <p className="text-sm font-GanwonEduAll_Bold mb-2">받은 후기</p>
              {loading ? (
                <p className="text-[#999999] text-sm">리뷰를 불러오는 중...</p>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : contentCounts.length === 0 ? (
                <p className="text-sm text-[#aaa]">아직 후기가 없어요.</p>
              ) : (
                <div className="flex flex-col w-full space-y-1 overflow-hidden max-h-[1000px]">
                  {contentCounts.map((item, idx) => {
                    const tagInfo = categories
                      .flatMap((cat) => cat.tags)
                      .find((tag) => tag.text === item.content);
                    const icon = tagInfo ? tagInfo.icon : "";
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between w-full"
                      >
                        <span className="text-sm text-[#666666] font-GanwonEduAll_Light flex items-center gap-1">
                          {icon && (
                            <span className="mr-1 w-[18px] inline-flex items-center justify-center">
                              {icon}
                            </span>
                          )}
                          {item.content}
                        </span>
                        <div className="flex items-center gap-1">
                          <img
                            src={peopleIcon}
                            alt="사람 수"
                            className="w-[14px] h-[14px]"
                          />
                          <span className="text-sm text-[#666666] font-GanwonEduAll_Light min-w-[10px] text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-[#BD4B2C] text-sm mt-2 w-full text-center font-GanwonEduAll_Bold"
                  >
                    간략히 보기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;

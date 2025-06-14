import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import help_icon from "../../assets/img/icons/Review/help.svg";
import stamp from "../../assets/img/stamp.svg";
import star_0 from "../../assets/img/icons/Review/star_0.svg";
import star_1 from "../../assets/img/icons/Review/star_1.svg";
import sampleProfile from "../../assets/img/sample/sample_profile.svg";
import NavBar from "../../components/NavBar";
import largeNextButton from "../../assets/img/icons/Login/l_btn_fill.svg";

const ReviewPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <>
      <NavBar />
      {/* 상단 헤더 */}
      <div className="absolute top-[50px] z-50 text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">후기 작성</p>
        <img
          src={help_icon}
          alt="도움말"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
        />
      </div>

      <div className="w-full flex flex-col items-center px-4">
        {/* 리뷰 카드 */}
        <div className="mb-2 bg-white rounded-xl shadow p-1 flex flex-col items-center w-full max-w-md" style={{ minHeight: 'unset', height: 'auto' }}>
          <div className="relative m-2">
            <div className="relative w-12 h-12">
              <img src={stamp} alt="스탬프" className="w-full h-full" />
              <img
                src={sampleProfile}
                alt="상대방 프로필"
                className="absolute top-1/2 left-1/2 w-10 h-10 rounded-md -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <p className="text-center text-l mb-2 font-GanwonEduAll_Bold">
            '커피'은(는) 어떤 친구였나요?
          </p>
          <div className="flex space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={rating >= i ? star_1 : star_0}
                alt={`star_${i}`}
                className="w-7 h-7 cursor-pointer"
                onClick={() => setRating(i)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow px-6 py-1 w-full max-w-md" style={{ minHeight: 'unset', height: 'auto' }}>
          {/* 키워드 선택 안내 */}
          <p className="text-sm font-semibold mb-2 font-GanwonEduAll_Bold">
            친구의 어떤 점이 좋았나요?{" "}
            <span className="text-gray-400">(1개~5개)</span>
          </p>
          <Swiper spaceBetween={12} slidesPerView={1} className="mb-4">
            {categories.map((category) => (
              <SwiperSlide key={category.title}>
                <div>
                  <p className="text-sm font-semibold mb-2">{category.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <button
                        key={tag.text}
                        className={`inline-flex items-center text-sm px-3 py-1 rounded-[4px] border transition whitespace-nowrap shadow-sm ${selectedTags.includes(tag.text)
                          ? "bg-[#BD4B2C]/20 border-[#BD4B2C] text-[#BD4B2C] shadow-md"
                          : "bg-white text-gray-700 border-gray-300 shadow font-GanwonEduAll_Bold"
                        }`}
                        style={selectedTags.includes(tag.text) ? { boxShadow: '0 2px 8px 0 rgba(189,75,44,0.10)' } : {}}
                        onClick={() => toggleTag(tag.text)}
                      >
                        {tag.icon && <span className="mr-1">{tag.icon}</span>}
                        {tag.text}
                      </button>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 완료 버튼 */}
        <button
          className="relative w-full max-w-md my-4 h-[45px] flex items-center justify-center overflow-hidden transition-opacity duration-200 mx-auto"
        >
          <img
            src={largeNextButton}
            alt="완료"
            className="absolute inset-0 w-full h-full object-fill "
          />
          <span className="relative z-10 font-GanwonEduAll_Bold text-[#333]">
            완료
          </span>
        </button>
      </div>
    </>
  );
};

export default ReviewPage;

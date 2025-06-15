import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../Utils/store";

import back_arrow from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import help_icon from "../../assets/img/icons/Review/help.svg";
import stamp from "../../assets/img/stamp.svg";
import star_0 from "../../assets/img/icons/Review/star_0.svg";
import star_1 from "../../assets/img/icons/Review/star_1.svg";
import sampleProfile from "../../assets/img/sample/sample_profile.svg";
import NavBar from "../../components/NavBar";
import largeNextButton from "../../assets/img/icons/Login/l_btn_fill.svg";
import { RootState } from "../../Utils/store";
import { UserState, fetchUser } from "../../Utils/userSlice";

interface Match {
  id: number;
  matchedAt: string;
  status: string;
  agreed: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;

  sessionId: number;
  roomId: number;

  user1Id: number;
  user1Nickname: string;
  user1ImageUrl: string | null;

  user2Id: number;
  user2Nickname: string;
  user2ImageUrl: string | null;
}

const ReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams();
  const [rating, setRating] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user) as UserState | null;
  const myId = user?.userId;

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserData = async () => {
      try {
        await dispatch(fetchUser()).unwrap();
      } catch (err) {
        console.error("사용자 정보 로드 실패:", err);
        setError("사용자 정보를 불러올 수 없습니다.");
        setLoading(false);
      }
    };

    if (!user) {
      loadUserData();
    }
  }, [dispatch, user]);

  // 매치 정보 로드
  useEffect(() => {
    const fetchMatchData = async () => {
      if (!myId || !userId) return;

      try {
        const response = await axios.get(`https://www.mannamdeliveries.link/api/matches`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // userId와 일치하는 매치 찾기
        const match = response.data.find((match: Match) => {
          const opponentId = match.user1Id === myId ? match.user2Id : match.user1Id;
          return opponentId.toString() === userId;
        });

        if (match) {
          setMatchData(match);
        } else {
          setError("매칭 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("매칭 정보를 불러올 수 없습니다.");
        console.error("매칭 정보 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (myId) {
      fetchMatchData();
    }
  }, [userId, myId]);

  const handleSubmit = async () => {
    if (!matchData || selectedTags.length === 0) {
      alert("별점과 키워드를 선택해주세요.");
      return;
    }

    // 매칭 상태에 따른 step 값 설정
    let step = 1;
    switch (matchData.status) {
      case 'Survey_Cancelled':
        step = 1;
        break;
      case 'Chat_Cancelled':
        step = 2;
        break;
      case 'Reviewing':
        step = 3;
        break;
      default:
        step = 1;
    }

    const requestData = {
      rating,
      content: selectedTags.join(','),
      step
    };

    console.log('리뷰 등록 요청 데이터:', {
      url: `https://www.mannamdeliveries.link/api/review/${userId}`,
      method: 'POST',
      data: requestData
    });

    try {
      const response = await axios.post(`https://www.mannamdeliveries.link/api/review/${userId}`, requestData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('리뷰 등록 응답 데이터:', {
        status: response.status,
        data: response.data
      });

      if (response.status === 200 || response.status === 201) {
        alert("후기가 성공적으로 등록되었습니다.");
        navigate(-1);
      } else {
        throw new Error("후기 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("리뷰 작성 실패:", err);
      if (axios.isAxiosError(err)) {
        console.error('에러 상세 정보:', {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
        alert(`후기 등록에 실패했습니다: ${err.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`);
      } else {
        alert("후기 등록에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩중...</div>;
  }

  if (error || !matchData) {
    return <div className="flex justify-center items-center h-screen">{error || "매칭 정보를 찾을 수 없습니다."}</div>;
  }

  const opponentNickname = matchData.user1Id === myId ? matchData.user2Nickname : matchData.user1Nickname;
  const opponentImage = matchData.user1Id === myId ? matchData.user2ImageUrl : matchData.user1ImageUrl;

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
                src={opponentImage || sampleProfile}
                alt="상대방 프로필"
                className="absolute top-1/2 left-1/2 w-10 h-10 rounded-md -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <p className="text-center text-l mb-2 font-GanwonEduAll_Bold">
            '{opponentNickname}'은(는) 어떤 친구였나요?
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
          <p className="text-sm font-semibold mb-2 font-GanwonEduAll_Light font-bold">
            친구의 어떤 점이 좋았나요?{" "}
            <span className="text-gray-400">(1개~5개)</span>
          </p>
          <Swiper spaceBetween={12} slidesPerView={1} className="mb-4">
            {categories.map((category) => (
              <SwiperSlide key={category.title}>
                <div>
                  <p className="text-sm font-semibold mb-2 font-GanwonEduAll_Light">{category.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <button
                        key={tag.text}
                        className={` font-bold font-GanwonEduAll_Light inline-flex items-center text-sm px-3 py-1 rounded-[4px] border transition whitespace-nowrap shadow-sm ${selectedTags.includes(tag.text)
                          ? "bg-[#BD4B2C]/20 border-[#BD4B2C] text-[#BD4B2C] shadow-md"
                          : "bg-white text-gray-700 border-gray-300 shadow"
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
          onClick={handleSubmit}
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

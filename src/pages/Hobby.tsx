import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Utils/store";
import { UserState } from "../Utils/userSlice";
import axios from "axios";
import NavBar from "../components/NavBar";
import check_icon from "../assets/img/icons/HobbyIcon/check.svg";
import back_arrow from "../assets/img/icons/HobbyIcon/back_arrow.svg";
import TagGroup from "../components/TagGroup";
import hobbyIcon from "../assets/img/sample/hobby_icon.svg";

function Hobby() {
  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;

  useEffect(() => {
    if (user?.interests) {
      const parseInterests = user.interests
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag != "");

      setSelectedTags(parseInterests);
    }
  }, [user]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 10) return; // 최대 10개 제한
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(
        "https://www.mannamdeliveries.link/api/user",
        { interests: selectedTags.join(",") },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("저장 완료!");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했어요.");
    }
  };

  const appreciationContent = [
    "영화",
    "인디 영화",
    "드라마",
    "뉴스",
    "유튜브",
    "뮤지컬",
    "연극",
    "클래식 음악",
    "재즈",
    "라디오",
    "K-pop",
    "게임 방송",
    "웹툰",
    "만화책",
    "소설",
    "자기계발서",
    "콘서트",
    "전시회",
    "사진전",
    "박물관",
    "팝업 행사",
  ];

  const gameTags = [
    "보드게임",
    "모바일",
    "콘솔",
    "닌텐도",
    "리그 오브 레전드",
    "롤토체스",
    "오버워치",
    "발로란트",
    "배틀그라운드",
    "스팀",
    "PC",
  ];

  const travelTags = [
    "맛집 탐방",
    "분위기 좋은 카페",
    "시장 구경",
    "캠핑",
    "차박",
    "노래방",
    "만화카페",
    "국내 여행",
    "해외 여행",
    "산",
    "바다",
  ];

  const creativeTags = [
    "그림 그리기",
    "일러스트 작업",
    "캘리그라피",
    "사진 촬영",
    "사진 보정",
    "영상 편집",
    "영상 제작",
    "콘텐츠 기획",
    "웹툰 제작",
    "노래",
    "작곡",
    "연주 활동",
    "글쓰기",
    "시 쓰기",
    "도예",
    "인테리어 꾸미기",
    "DIY 소품 만들기",
  ];

  const exerciseTags = [
    "헬스",
    "필라테스",
    "요가",
    "러닝",
    "자전거",
    "줄넘기",
    "배드민턴",
    "테니스",
    "골프",
    "볼링",
    "농구",
    "축구",
    "야구",
    "탁구",
    "등산",
    "댄스",
    "클라이밍",
    "인라인 스케이트",
    "보드",
    "스키",
    "수영",
    "서핑",
  ];

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/main?modal=true");
  };

  return (
    <>
      <NavBar />
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">관심사</p>
        <img
          src={check_icon}
          alt="check_icon"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          onClick={handleSubmit}
        />
      </div>

      <div className="flex flex-col w-full h-[calc(100%-200px)] overflow-y-auto p-4 z-0 bg-[#F2F2F2]">
        <TagGroup
          title="감상 콘텐츠"
          tags={appreciationContent}
          selectedTags={selectedTags}
          onToggle={toggleTag}
          icon={hobbyIcon}
        />
        <TagGroup
          title="게임"
          tags={gameTags}
          selectedTags={selectedTags}
          onToggle={toggleTag}
          icon={hobbyIcon}
        />
        <TagGroup
          title="놀러 나가기"
          tags={travelTags}
          selectedTags={selectedTags}
          onToggle={toggleTag}
          icon={hobbyIcon}
        />
        <TagGroup
          title="크리에이티브"
          tags={creativeTags}
          selectedTags={selectedTags}
          onToggle={toggleTag}
          icon={hobbyIcon}
        />
        <TagGroup
          title="운동활동"
          tags={exerciseTags}
          selectedTags={selectedTags}
          onToggle={toggleTag}
          icon={hobbyIcon}
        />
      </div>

      <div className="flex justify-between items-center mb-2 w-full">
        <span className="text-xs font-GanwonEduAll_Light text-gray-500 pl-3">
          나와 취향이 비슷한 친구와 만날 수 있어요
        </span>
        <span className="text-xs font-GanwonEduAll_Light text-gray-500 pr-3">
          {selectedTags.length} / 10
        </span>
      </div>
    </>
  );
}

export default Hobby;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Utils/store";
import { fetchUser } from "../../Utils/userSlice";

import NavBar from "../../components/NavBar";
import ItemCard from "./components/ItemCard";
import bell_default from "../../assets/img/icons/NavIcon/bell_default.svg";

type MatchData = {
  id: number;
  matchedAt: string;
  status: string;
  relatedId: number;
  user1Id: number;
  user1Nickname: string;
  user1ImageUrl: string;
  user2Id: number;
  user2Nickname: string;
  user2ImageUrl: string;
};

function ChatListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState<MatchData[]>([]);

  useEffect(() => {
    dispatch(fetchUser());

    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        setMatchList(data);
      } catch (e) {
        const fallbackRes = await fetch("./ChatListFallBack.json");
        const fallbackData = await fallbackRes.json();
        setMatchList(fallbackData);
      }
    };

    fetchMatches();
  }, [dispatch]);

  const chattingList = matchList.filter((m) => m.status === "Chatting");
  const surveyList = matchList.filter((m) => m.status === "Surveying");

  const handleChatClick = (id: number) => navigate(`/chat/${id}`);
  const handleSurveyClick = (id: number) => navigate(`/survey/${id}`);

  return (
    <>
      <NavBar />

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 센터</p>
        <img
          src={bell_default}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>

      <div className="flex flex-col w-full h-[calc(100%-200px)] overflow-y-auto px-4 z-0">
        <h2 className="text-xl font-GanwonEduAll_Bold text-center mb-2">
          채팅 목록
        </h2>
        {chattingList.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className="cursor-pointer"
          >
            <ItemCard
              profileImageUrl={chat.user2ImageUrl}
              username={chat.user2Nickname}
              time={chat.matchedAt}
            />
          </div>
        ))}

        <h2 className="text-xl font-GanwonEduAll_Bold text-center mt-6 mb-2">
          설문 목록
        </h2>
        {surveyList.map((survey) => (
          <div
            key={survey.id}
            onClick={() => handleSurveyClick(survey.id)}
            className="cursor-pointer"
          >
            <ItemCard
              profileImageUrl={survey.user2ImageUrl}
              username={survey.user2Nickname}
              time={survey.matchedAt}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatListPage;

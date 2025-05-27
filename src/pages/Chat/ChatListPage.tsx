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
  agreed: boolean;
  relatedId: number;
  user1Id: number;
  user1Nickname: string;
  user1ImageUrl: string | undefined;
  user2Id: number;
  user2Nickname: string;
  user2ImageUrl: string | undefined;
};

function ChatListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState<MatchData[]>([]);

  useEffect(() => {
    dispatch(fetchUser());

    const fetchMatches = async () => {
      try {
        console.log("[매치 불러오기] API 호출 시작...");
        const res = await fetch("https://www.mannamdeliveries.link/matches/1");

        console.log(`[매치 불러오기] 응답 상태 코드: ${res.status}`);


        if (!res.ok) {
          throw new Error(`API 호출 실패: ${res.status}`);
        }

        const rawText = await res.text();
        console.log("[서버 응답 원문]", rawText);
        const data = JSON.parse(rawText);
        console.log("[매치 불러오기] 성공:", data);

        setMatchList(data);
      } catch (e) {
        console.error("[매치 불러오기] 실패:", e);
      
        // 더미 데이터 출력
        const dummyData: MatchData[] = [
          {
            id: 1,
            matchedAt: "2024-03-20T10:00:00",
            status: "Chatting",
            agreed: true,
            relatedId: 1,
            user1Id: 1,
            user1Nickname: "사용자1",
            user1ImageUrl: undefined,
            user2Id: 2,
            user2Nickname: "사용자2",
            user2ImageUrl: undefined
          },
          {
            id: 2,
            matchedAt: "2024-03-20T11:00:00",
            status: "Surveying",
            agreed: true,
            relatedId: 2,
            user1Id: 1,
            user1Nickname: "사용자1",
            user1ImageUrl: undefined,
            user2Id: 3,
            user2Nickname: "사용자3",
            user2ImageUrl: undefined
          }
        ];

        console.log("[매치 불러오기] 더미 데이터 사용:", dummyData);
        setMatchList(dummyData);
      }
    };

    fetchMatches();
  }, [dispatch]);

  const chattingList = matchList.filter((m) => m.status === "Chatting" && m.agreed === true);
  const surveyList = matchList.filter((m) => m.status === "Surveying" || (m.status === "Chatting" && m.agreed === false));

  const handleChatClick = (match: MatchData) => {
    console.log('채팅방 입장:', match.id);
    navigate(`/chat/${match.id}`, {
      state: {
        roomId: match.id,
        user1Id: match.user1Id,
        user1Nickname: match.user1Nickname,
        user2Id: match.user2Id,
        user2Nickname: match.user2Nickname,
      }
    });
  };

  const handleSurveyClick = (match: MatchData) => {
    console.log('설문방 입장:', match.id);
    navigate(`/survey/${match.id}`, {
      state: {
        roomId: match.id,
        status: match.status,
        user1Id: match.user1Id,
        user1Nickname: match.user1Nickname,
        user2Id: match.user2Id,
        user2Nickname: match.user2Nickname,
        matchedAt: match.matchedAt,
        agreed: match.agreed,
        id: match.id
      }
    });
  };

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
        {chattingList.length > 0 && (
          <>
            <h2 className="text-xl font-GanwonEduAll_Bold text-center mb-2">
              채팅 목록
            </h2>
            {chattingList.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className="cursor-pointer"
              >
                <ItemCard
                  profileImageUrl={chat.user2ImageUrl}
                  username={chat.user2Nickname}
                  time={chat.matchedAt}
                />
              </div>
            ))}
          </>)}

        {surveyList.length > 0 && (
          <>
            <h2 className="text-xl font-GanwonEduAll_Bold text-center mt-6 mb-2">
              설문 목록
            </h2>
            {surveyList.map((survey) => (
              <div
                key={survey.id}
                onClick={() => handleSurveyClick(survey)}
                className="cursor-pointer"
              >
                <ItemCard
                  profileImageUrl={survey.user2ImageUrl}
                  username={survey.user2Nickname}
                  time={survey.matchedAt}
                />
              </div>
            ))}
          </>)}

      </div>
    </>
  );
}

export default ChatListPage;

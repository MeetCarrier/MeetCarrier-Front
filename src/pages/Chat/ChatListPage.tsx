import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Utils/store";
import { fetchUser, UserState } from "../../Utils/userSlice";

import NavBar from "../../components/NavBar";
import ItemCard from "./components/ItemCard";
import bell_default from "../../assets/img/icons/NavIcon/bell_default.svg";

type MatchData = {
  id: number;
  matchedAt: string;
  status: string;
  agreed: boolean;

  sessionId: number;
  roomId: number;

  user1Id: number;
  user1Nickname: string;
  user1ImageUrl: string | null;

  user2Id: number;
  user2Nickname: string;
  user2ImageUrl: string | null;
};

function ChatListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState<MatchData[]>([]);
  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;
  const myId = user?.userId;

  useEffect(() => {
    dispatch(fetchUser());

    const fetchMatches = async () => {
      try {
        console.log("[매치 불러오기] API 호출 시작...");
        const res = await fetch(
          "https://www.mannamdeliveries.link/api/matches",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`[매치 불러오기] 응답 상태 코드: ${res.status}`);

        if (!res.ok) {
          throw new Error(`API 호출 실패: ${res.status}`);
        }

        const data = await res.json();
        console.log("[매치 불러오기] 성공:", data);
        setMatchList(data);
      } catch (e) {
        console.error("[매치 불러오기] 실패:", e);
      }
    };

    fetchMatches();
  }, [dispatch]);

  const chattingList = matchList.filter(
    (m) => m.status === "Chatting" && m.agreed === true
  );
  const surveyList = matchList.filter(
    (m) =>
      m.status === "Surveying" ||
      (m.status === "Chatting" && m.agreed === false)
  );

  const handleChatClick = (match: MatchData) => {
    navigate(`/chat/${match.roomId}`, {
      state: {
        roomId: match.roomId,
        user1Id: match.user1Id,
        user1Nickname: match.user1Nickname,
        user2Id: match.user2Id,
        user2Nickname: match.user2Nickname,
        matchId: match.id
      },
    });
  };

  const handleSurveyClick = (match: MatchData) => {
    navigate(`/survey/${match.sessionId}`, {
      state: {
        id: match.id,
        sessionId: match.sessionId,
        status: match.status,
        user1Id: match.user1Id,
        user1Nickname: match.user1Nickname,
        user2Id: match.user2Id,
        user2Nickname: match.user2Nickname,
        matchedAt: match.matchedAt,
        agreed: match.agreed,
      },
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

      <div className="flex flex-col w-full h-[calc(100%-200px)] overflow-y-auto z-0">
        {chattingList.length > 0 && (
          <>
            <h2 className="text-xl font-GanwonEduAll_Bold text-center mb-2">
              채팅 목록
            </h2>
            {chattingList.map((chat) => {
              const opponentNickname =
                chat.user1Id === myId ? chat.user2Nickname : chat.user1Nickname;
              const opponentImage =
                chat.user1Id === myId ? chat.user2ImageUrl : chat.user1ImageUrl;
              return (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className="cursor-pointer"
                >
                  <ItemCard
                    profileImageUrl={opponentImage ?? undefined}
                    username={opponentNickname}
                    time={chat.matchedAt}
                  />
                </div>
              );
            })}
          </>
        )}

        {surveyList.length > 0 && (
          <>
            <h2 className="text-xl font-GanwonEduAll_Bold text-center mt-6 mb-2">
              설문 목록
            </h2>
            {surveyList.map((survey) => {
              const opponentNickname =
                survey.user1Id === myId
                  ? survey.user2Nickname
                  : survey.user1Nickname;
              const opponentImage =
                survey.user1Id === myId
                  ? survey.user2ImageUrl
                  : survey.user1ImageUrl;
              return (
                <div
                  key={survey.id}
                  onClick={() => handleSurveyClick(survey)}
                  className="cursor-pointer"
                >
                  <ItemCard
                    profileImageUrl={opponentImage ?? undefined}
                    username={opponentNickname}
                    time={survey.matchedAt}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default ChatListPage;

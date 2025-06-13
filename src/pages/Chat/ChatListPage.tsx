import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Utils/store";
import { fetchUser, UserState } from "../../Utils/userSlice";
import axios from "axios";
import { fetchUserById, UserProfileData } from "../../Utils/api";

import NavBar from "../../components/NavBar";
import ItemCard from "./components/ItemCard";
import ProfileModal from "../../components/ProfileModal";
import bell_default from "../../assets/img/icons/NavIcon/bell_default.svg";

type MatchData = {
  id: number;
  matchedAt: string;
  status: string;
  agreed: boolean;
  lastMessage: string;
  lastMessageAt: string;

  sessionId: number;
  roomId: number;

  user1Id: number;
  user1Nickname: string;
  user1ImageUrl: string | null;

  user2Id: number;
  user2Nickname: string;
  user2ImageUrl: string | null;
};

type UserProfileData = {
  userId: number;
  nickname: string;
  imageUrl: string | null;
  // Add any other necessary properties here
};

function ChatListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState<MatchData[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(
    null
  );
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
  const cancelledList = matchList.filter(
    (m) => m.status === "Survey_Cancelled" || m.status === "Chat_Cancelled"
  );

  const handleChatClick = (match: MatchData) => {
    navigate(`/chat/${match.roomId}`, {
      state: {
        roomId: match.roomId,
      },
    });
  };

  const handleSurveyClick = (match: MatchData) => {
    navigate(`/survey/${match.sessionId}`, {
      state: {
        sessionId: match.sessionId,
      },
    });
  };

  const handleReviewClick = (match: MatchData) => {
    // TODO: 후기 작성 페이지로 이동
    console.log("후기 작성:", match);
  };

  const handleProfileClick = async (opponentId: number) => {
    try {
      const userData = await fetchUserById(opponentId);
      setSelectedUser(userData);
      setShowProfileModal(true);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
    }
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
              const opponentId =
                chat.user1Id === myId ? chat.user2Id : chat.user1Id;
              return (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className="cursor-pointer"
                >
                  <ItemCard
                    profileImageUrl={opponentImage ?? undefined}
                    username={opponentNickname}
                    time={chat.lastMessageAt ?? chat.matchedAt}
                    lastMessage={chat.lastMessage}
                    opponentId={opponentId}
                    onProfileClick={() => handleProfileClick(opponentId)}
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
              const opponentId =
                survey.user1Id === myId ? survey.user2Id : survey.user1Id;
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
                    opponentId={opponentId}
                    onProfileClick={() => handleProfileClick(opponentId)}
                  />
                </div>
              );
            })}
          </>
        )}

        {cancelledList.length > 0 && (
          <>
            <h2 className="text-xl font-GanwonEduAll_Bold text-center mt-6 mb-2">
              종료된 만남
            </h2>
            {cancelledList.map((cancelled) => {
              const opponentNickname =
                cancelled.user1Id === myId
                  ? cancelled.user2Nickname
                  : cancelled.user1Nickname;
              const opponentImage =
                cancelled.user1Id === myId
                  ? cancelled.user2ImageUrl
                  : cancelled.user1ImageUrl;
              const opponentId =
                cancelled.user1Id === myId
                  ? cancelled.user2Id
                  : cancelled.user1Id;
              return (
                <div key={cancelled.id} className="cursor-pointer">
                  <ItemCard
                    profileImageUrl={opponentImage ?? undefined}
                    username={opponentNickname}
                    time={cancelled.matchedAt}
                    opponentId={opponentId}
                    status={cancelled.status}
                    onProfileClick={() => handleProfileClick(opponentId)}
                    onClickReview={() => handleReviewClick(cancelled)}
                    onClick={() => {
                      if (cancelled.status === "Survey_Cancelled") {
                        handleSurveyClick(cancelled);
                      } else if (cancelled.status === "Chat_Cancelled") {
                        handleChatClick(cancelled);
                      }
                    }}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      {showProfileModal && selectedUser && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={selectedUser}
        />
      )}
    </>
  );
}

export default ChatListPage;

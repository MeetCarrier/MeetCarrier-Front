import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Utils/store";
import { fetchUser } from "../../Utils/userSlice";

import NavBar from "../../components/NavBar";
import ItemCard from "./components/ItemCard";
import sampleProfile from "../../assets/img/sample/sample_profile.svg";
import bell_default from "../../assets/img/icons/NavIcon/bell_default.svg";

type Chat = {
  id: number;
  name: string;
  timestamp: string;
  profileImageUrl: string;
};

type Survey = {
  id: number;
  name: string;
  timestamp: string;
  profileImageUrl: string;
};

const dummyChatList: Chat[] = [
  {
    id: 1,
    name: "김철수",
    timestamp: "2025-05-06T14:30:00",
    profileImageUrl: sampleProfile,
  },
  {
    id: 2,
    name: "박영희",
    timestamp: "2025-05-05T11:10:00",
    profileImageUrl: sampleProfile,
  },
];

const dummySurveyList: Survey[] = [
  {
    id: 101,
    name: "이번 만남 어땠나요?",
    timestamp: "2025-05-05T18:00:00",
    profileImageUrl: sampleProfile,
  },
  {
    id: 102,
    name: "매칭 만족도를 평가해주세요",
    timestamp: "2025-05-04T10:20:00",
    profileImageUrl: sampleProfile,
  },
];

function ChatListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleChatClick = (chatId: number) => {
    navigate(`/chat/${chatId}`);
  };

  const handleSurveyClick = (surveyId: number) => {
    navigate(`/survey/${surveyId}`);
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

      <div className="absolute top-[0px] flex flex-col pt-[100px] pb-[100px] w-[90%] max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-GanwonEduAll_Bold text-center mb-2">
          채팅 목록
        </h2>
        {dummyChatList.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className="cursor-pointer"
          >
            <ItemCard
              profileImageUrl={chat.profileImageUrl}
              username={chat.name}
              time={chat.timestamp}
            />
          </div>
        ))}

        <h2 className="text-xl font-GanwonEduAll_Bold text-center mt-6 mb-2">
          설문 목록
        </h2>
        {dummySurveyList.map((survey) => (
          <div
            key={survey.id}
            onClick={() => handleSurveyClick(survey.id)}
            className="cursor-pointer"
          >
            <ItemCard
              profileImageUrl={survey.profileImageUrl}
              username={survey.name}
              time={survey.timestamp}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatListPage;

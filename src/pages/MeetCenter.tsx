import NavBar from '../components/NavBar';
import ChatRoom from '../components/ChatRoom';
import SurveyRoom from '../components/SurveyRoom';

import { FormatTimestamp } from '../Utils/FormatTimeStamp';

import bell_default from '../assets/img/icons/NavIcon/bell_default.webp';
import sample_profile from '../assets/img/sample/sample_profile.svg';

// 나중에 백이랑 해서 .map 으로 컴포넌트 채우면 될 듯

function MeetCenter() {
  return (
    <>
      <NavBar />
      <div className="absolute top-[50px] left-0 right-0 px-6 text-center z-10">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 센터</p>
        <img
          src={bell_default}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>
      <div className="flex flex-col w-full h-[calc(100%-200px)] overflow-y-auto px-4 z-0">
        <ChatRoom
          profileImage={sample_profile}
          name="이땃쥐돌이"
          message="와아아아앙ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ아아ㅏ아아ㅏㅏ"
          time={FormatTimestamp('2025-05-02T21:44:00')}
          unreadCount={100}
        />
        <ChatRoom
          profileImage={sample_profile}
          name="Dsky"
          message="하위"
          time={FormatTimestamp('2024-05-02T21:44:00')}
          unreadCount={0}
        />
        <ChatRoom
          profileImage={sample_profile}
          name="Dsky"
          message="하위"
          time={FormatTimestamp('2025-05-03T12:44:00')}
          unreadCount={10}
        />
        <ChatRoom
          profileImage={sample_profile}
          name="Dsky"
          message="하위"
          time={FormatTimestamp('2024-05-02T21:44:00')}
          unreadCount={1}
        />
        <ChatRoom
          profileImage={sample_profile}
          name="Dsky"
          message="하위"
          time={FormatTimestamp('2024-05-02T21:44:00')}
          unreadCount={15}
        />
        <ChatRoom
          profileImage={sample_profile}
          name="Dsky"
          message="하위"
          time={FormatTimestamp('2024-05-02T21:44:00')}
          unreadCount={200}
        />
        <ChatRoom
          profileImage={sample_profile}
          name="Dsky"
          message="하위"
          time={FormatTimestamp('2024-05-02T21:44:00')}
          unreadCount={10}
        />
        <SurveyRoom
          countImage={3}
          name="Dsky"
          message="개가 벽보고 한 말은? 월월 ㅋㅋ"
          time={FormatTimestamp('2025-05-03T18:44:00')}
          unreadCount={1}
        />
        <SurveyRoom
          countImage={5}
          name="리액트"
          message="우유가 넘어지면? 아야 ㅋㅋ"
          time={FormatTimestamp('2025-05-03T18:44:00')}
        />
      </div>
    </>
  );
}

export default MeetCenter;

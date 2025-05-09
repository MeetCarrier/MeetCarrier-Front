import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../Utils/userSlice';
import axios from 'axios';
import ChatBar from './components/ChatBar';

import back_arrow from '../../assets/img/icons/HobbyIcon/back_arrow.svg';
import search_icon from '../../assets/img/icons/ChatIcon/search.svg';

function ChatPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/main');
  };

  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiHeight = emojiOpen ? 200 : 0;

  return (
    // 제목에 닉네임 뜨도록 해야함., 돋보기 기능 넣어야 함.
    <>
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">이땃쥐돌이</p>
        <img
          src={search_icon}
          alt="search_icon"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          // onClick={handleSubmit}
        />
      </div>

      {/* 하단 입력창 */}
      <ChatBar
        emojiOpen={emojiOpen}
        onEmojiToggle={() => setEmojiOpen((prev) => !prev)}
      />

      <div
        className="flex flex-col w-full overflow-y-auto p-4 z-0 bg-[#F2F2F2]"
        style={{
          height: `calc(100% - 240px - ${emojiHeight}px)`,
          transition: 'height 0.3s ease',
        }}
      >
        {/* 내용 */}
      </div>
    </>
  );
}

export default ChatPage;

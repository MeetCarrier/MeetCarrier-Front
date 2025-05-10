import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserState } from '../Utils/userSlice';
import axios from 'axios';
import ChatBar from './components/ChatBar';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import back_arrow from '../../assets/img/icons/HobbyIcon/back_arrow.svg';
import search_icon from '../../assets/img/icons/ChatIcon/search.svg';

interface ChatMessage {
  messageType: string;
  message: string;
  imageUrl: string | null;
  sender: number;
  sentAt: string;
}

function ChatPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojiHeight = emojiOpen ? 200 : 0;

  useEffect(() => {
    // 채팅 기록 조회
    const fetchChatHistory = async () => {
      try {
        console.log('채팅 기록 조회 시작:', roomId);
        const response = await axios.get(`https://www.mannamdeliveries.link/chat/1`);
        console.log('채팅 기록 조회 결과:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('채팅 기록 조회 실패:', error);
      }
    };

    // WebSocket 연결 설정
    console.log('WebSocket 연결 시작');
    const socket = new SockJS('https://www.mannamdeliveries.link/connection');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        // 채팅방 구독
        stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log('새로운 메시지 수신:', newMessage);
          setMessages((prev) => [...prev, newMessage]);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 해제');
      },
      onStompError: (frame) => {
        console.error('STOMP 에러 발생:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket 에러 발생:', event);
      }
    });

    stompClientRef.current = stompClient;
    stompClient.activate();

    fetchChatHistory();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      console.log('컴포넌트 언마운트 - WebSocket 연결 해제');
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [roomId]);

  // 메시지 전송 함수
  const sendMessage = (message: string) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      const messageData = {
        roomId: 1,
        type: 'TEXT',
        message: message,
        imageUrl: null
      };
      console.log('메시지 전송:', messageData);
      stompClientRef.current.publish({
        destination: '/app/chat/send',
        body: JSON.stringify(messageData)
      });
    } else {
      console.warn('WebSocket이 연결되어 있지 않습니다.');
    }
  };

  // 채팅방 퇴장 함수
  const handleLeave = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      const leaveData = {
        roomId: 1,
        type: 'LEAVE'
      };
      console.log('채팅방 퇴장 요청:', leaveData);
      stompClientRef.current.publish({
        destination: '/app/chat/leave',
        body: JSON.stringify(leaveData)
      });
    }
    navigate('/main');
  };

  const handleBackClick = () => {
    handleLeave();
  };

  // 스크롤을 항상 최신 메시지로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        onSendMessage={sendMessage}
      />
      
      <div
        className="flex flex-col w-full overflow-y-auto p-4 z-0 bg-[#F2F2F2]"
        style={{
          height: `calc(100% - 240px - ${emojiHeight}px)`,
          transition: 'height 0.3s ease',
        }}
      >
        {/* 내용 */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === 1 ? 'self-end' : 'self-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === 1
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.sentAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

    </>
  );
}

export default ChatPage;

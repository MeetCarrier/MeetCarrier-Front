import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { UserState } from '../Utils/userSlice';
import axios from 'axios';
import ChatBar from './components/ChatBar';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import sampleProfile from "../../assets/img/sample/sample_profile.svg";

import back_arrow from '../../assets/img/icons/HobbyIcon/back_arrow.svg';
import search_icon from '../../assets/img/icons/ChatIcon/search.svg';

interface ChatMessage {
  messageType: string;
  message: string;
  imageUrl: string | null;
  sender: number;
  sentAt: string;
}

interface LocationState {
  roomId: number;
  user1Id: number;
  user1Nickname: string;
  user2Id: number;
  user2Nickname: string;
}

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const state = location.state as LocationState;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojiHeight = emojiOpen ? 200 : 0;
  /* 서버용
  useEffect(() => {
    if (!state?.roomId) {
      console.error('방 정보가 없습니다.');
      navigate(-1);
      return;
    }

    // 채팅 기록 조회
    const fetchChatHistory = async () => {
      try {
        console.log('채팅 기록 조회 시작:', state.roomId);
        const response = await axios.get(`https://www.mannamdeliveries.link/chat/${state.roomId}`);
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
        stompClient.subscribe(`/topic/room/${state.roomId}`, (message) => {
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
  }, [state?.roomId, navigate]);
  */

  useEffect(() => {
    if (!state?.roomId) {
      console.error('방 정보가 없습니다.');
      navigate(-1);
      return;
    }

    // 더미 메시지 데이터 설정
    const dummyMessages: ChatMessage[] = [
      {
        messageType: 'TEXT',
        message: '안녕하세요!',
        imageUrl: null,
        sender: state.user1Id,
        sentAt: new Date().toISOString(),
      },
      {
        messageType: 'TEXT',
        message: '반가워요~',
        imageUrl: null,
        sender: state.user2Id,
        sentAt: new Date().toISOString(),
      },
      {
        messageType: 'TEXT',
        message: '반가워요~',
        imageUrl: null,
        sender: state.user2Id,
        sentAt: new Date().toISOString(),
      },
      {
        messageType: 'TEXT',
        message: '오늘 날씨 좋죠?',
        imageUrl: null,
        sender: state.user1Id,
        sentAt: new Date().toISOString(),
      },
    ];
    setMessages(dummyMessages);

    return () => {
      console.log('더미 테스트 - cleanup 호출');
    };
  }, [state?.roomId, navigate]);

  // 메시지 전송 함수
  const sendMessage = (message: string) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      const messageData = {
        roomId: state.roomId,
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
        roomId: state.roomId,
        type: 'LEAVE'
      };
      console.log('채팅방 퇴장 요청:', leaveData);
      stompClientRef.current.publish({
        destination: '/app/chat/leave',
        body: JSON.stringify(leaveData)
      });
    }
    navigate("/main");
  };

  const handleBackClick = () => {
    handleLeave();
  };

  // 스크롤을 항상 최신 메시지로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">{state?.user2Nickname || '상대방'}</p>
        <img
          src={search_icon}
          alt="search_icon"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
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
        {messages.map((msg, index) => {
          const isMine = msg.sender === state.user1Id;
          const isPrevSameSender = index > 0 && messages[index - 1].sender === msg.sender;
          const isNextDifferentSender =
            index === messages.length - 1 || messages[index + 1].sender !== msg.sender;

          const profileUrl = !isMine && msg.imageUrl ? msg.imageUrl : sampleProfile;
          const nickname = isMine ? state.user1Nickname : state.user2Nickname;

          return (
            <div
              key={index}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}
            >
              {/* 왼쪽 프로필 (처음 메시지일 때만) */}
              {!isMine && !isPrevSameSender ? (
                <div className="w-8 mr-2">
                  <img src={profileUrl} alt="프로필" className="w-8 h-8 rounded-[2px]" />
                </div>
              ) : (
                !isMine && <div className="w-8 mr-2" /> // 차지하는 공간 유지
              )}

              {/* 채팅 div */}
              <div
                className={`max-w-[70%] flex flex-col`} // ← 이 부분이 핵심
              >
                {/* 닉네임은 첫 메시지일 때만 */}
                {!isMine && !isPrevSameSender && (
                  <span className="text-sm text-gray-700 mb-1">{nickname}</span>
                )}

                <div
                  className={`px-3 py-2 rounded-xl whitespace-pre-wrap ${isMine
                      ? 'bg-[#BD4B2C] text-[#F2F2F2] rounded-br-none self-end'
                      : 'bg-[#FFFFFF] text-[#333333] rounded-bl-none'
                    }`}
                >
                  {msg.message}
                </div>

                {isNextDifferentSender && (
                  <span
                    className={`text-xs text-gray-400 mt-1 ${isMine ? 'text-right pr-1' : 'text-left pl-1'
                      }`}
                  >
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
    </>
  );
}

export default ChatPage;

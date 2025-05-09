import SockJS from 'sockjs-client';
import Stomp, { Message } from 'stompjs';

export interface StartMatchingOptions {
  onSuccess: (data: MatchSuccessData) => void;
  onFail: (data: MatchFailData) => void;
}

export interface MatchSuccessData {
  matchedUserId: number;
  finalScore: number;
  surveySessionId: number;
}

export interface MatchFailData {
  recommendedUserIds: number[];
  message: string;
}

export interface MatchingClient {
  disconnect: () => void;
}

// ✅ 매칭 클라이언트 시작 함수
export function startMatchingClient({
  onSuccess,
  onFail,
}: StartMatchingOptions): MatchingClient {
  const socket = new SockJS('https://www.mannamdeliveries.link/connection');
  const client = Stomp.over(socket);

  client.connect({}, () => {
    console.log('✅ WebSocket 연결됨');

    client.subscribe('/topic/match_result', (message: Message) => {
      const data = JSON.parse(message.body);

      if ('surveySessionId' in data) {
        onSuccess(data as MatchSuccessData);
      } else {
        onFail(data as MatchFailData);
      }
    });

    client.send('/app/start-matching', {}, '');
  });

  return {
    disconnect: () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log('🔌 WebSocket 연결 해제됨');
        });
      }
    },
  };
}

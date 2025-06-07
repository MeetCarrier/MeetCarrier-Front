import SockJS from 'sockjs-client';
import Stomp, { Message } from 'stompjs';

import { store } from './store';
import {
  setStatus,
  setSuccessData,
  setFailData,
  setSocketConnected,
} from './matchingSlice';

export interface StartMatchingOptions {
  onSuccess: (data: MatchSuccessData) => void;
  onFail: (data: MatchFailData) => void;
  onConnected: () => void;
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
  onConnected,
}: StartMatchingOptions): MatchingClient {
  const socket = new SockJS('https://www.mannamdeliveries.link/api/connection');
  const client = Stomp.over(socket);

  client.connect({}, () => {
    console.log('✅ WebSocket 연결됨');
    store.dispatch(setSocketConnected(true));
    onConnected?.();

    client.subscribe('/user/topic/match-result', (message: Message) => {
      const data = JSON.parse(message.body);

      console.log('소켓에서 데이터 받음 : ', data);

      if ('surveySessionId' in data) {
        store.dispatch(setSuccessData(data as MatchSuccessData));
        store.dispatch(setStatus('success'));

        onSuccess(data as MatchSuccessData);
      } else {
        store.dispatch(setFailData(data as MatchFailData));
        store.dispatch(setStatus('fail'));

        onFail(data as MatchFailData);
      }
    });

    client.send('/app/api/start-matching', {}, '');
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

// utils/fcm.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import axios from 'axios';

const firebaseConfig = {
  apiKey: 'AIzaSyDDKskTEH8iAfPKeXJ2E0hgYr40ORmoo7I',
  authDomain: 'mannam-d4e57.firebaseapp.com',
  projectId: 'mannam-d4e57',
  storageBucket: 'mannam-d4e57.firebasestorage.app',
  messagingSenderId: '818635958228',
  appId: '1:818635958228:web:b6ad2e0b61f1a9c3b49841',
};

let messaging: firebase.messaging.Messaging;

export const initializeFirebase = async () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
  }

  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    );
    console.log('Service Worker registered');

    // 권한 상태 확인
    if (Notification.permission !== 'granted') {
      console.log('알림 권한 없음 또는 거부됨. 토큰 요청 생략');
      return;
    }

    // 토큰 발급
    const currentToken = await messaging.getToken({
      vapidKey:
        'BL_f_s3clxhm9ZX-jLfgujT2lFGpb1C-jw1qTZIgXtnJjVthGsrXKLDBkxGUgHEfzz4-MFAyv3QRfAfqTZqcBeY',
      serviceWorkerRegistration: registration,
    });

    if (!currentToken) {
      console.log('FCM 토큰 없음');
      return;
    }

    const previousToken = localStorage.getItem('fcm_token');
    if (currentToken !== previousToken) {
      await sendTokenToServer(currentToken);
      localStorage.setItem('fcm_token', currentToken);
    } else {
      console.log('이전 토큰과 동일하여 전송 생략');
    }
  } catch (err) {
    console.error('FCM 초기화 실패:', err);
  }
};

const sendTokenToServer = async (token: string) => {
  try {
    await axios.post(
      'https://www.mannamdeliveries.link/api/fcm/token',
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    console.log('FCM 토큰 서버 전송 완료');
  } catch (err) {
    console.error('FCM 토큰 서버 전송 실패:', err);
  }
};

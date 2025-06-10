// utils/fcm.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

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

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      console.log('Service Worker registered');

      manageFcmToken(registration);
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }
};

const manageFcmToken = (registration: ServiceWorkerRegistration) => {
  const permission = Notification.permission;
  if (permission === 'granted') {
    getAndSendTokenIfChanged(registration);
  } else if (permission === 'default') {
    console.log('알림 권한이 아직 없음. 사용자 동의 필요');
    // UI 이벤트로 requestPermissionAndGetToken 호출해야 함
  } else {
    console.log('알림 권한 거부됨');
  }
};

export const requestPermissionAndGetToken = async (
  registration: ServiceWorkerRegistration
) => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    getAndSendTokenIfChanged(registration);
  } else {
    console.log('사용자가 권한을 거부함');
  }
};

const getAndSendTokenIfChanged = async (
  registration: ServiceWorkerRegistration
) => {
  try {
    const currentToken = await messaging.getToken({
      vapidKey:
        'BL_f_s3clxhm9ZX-jLfgujT2lFGpb1C-jw1qTZIgXtnJjVthGsrXKLDBkxGUgHEfzz4-MFAyv3QRfAfqTZqcBeY',
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      const previousToken = localStorage.getItem('fcm_token');
      if (currentToken !== previousToken) {
        await sendTokenToServer(currentToken);
        localStorage.setItem('fcm_token', currentToken);
      }
    } else {
      console.log('토큰 없음');
    }
  } catch (err) {
    console.error('토큰 처리 실패:', err);
  }
};

const sendTokenToServer = async (token: string) => {
  await fetch('/api/fcm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  console.log('FCM 토큰 서버 전송 완료');
};

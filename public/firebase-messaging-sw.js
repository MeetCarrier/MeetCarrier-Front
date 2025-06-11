importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyDDKskTEH8iAfPKeXJ2E0hgYr40ORmoo7I',
  authDomain: 'mannam-d4e57.firebaseapp.com',
  projectId: 'mannam-d4e57',
  storageBucket: 'mannam-d4e57.firebasestorage.app',
  messagingSenderId: '818635958228',
  appId: '1:818635958228:web:b6ad2e0b61f1a9c3b49841',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지:', payload);
  const chatRoomId = payload.data.chatRoomId;
  const notificationTitle = payload.data.title;
  // 기본 옵션 객체
  const notificationOptions = {
    body: payload.data.body,
    data: payload.data,
  };

  // 채팅방 ID가 있을 때만 tag와 renotify 옵션 추가
  if (chatRoomId) {
    notificationOptions.tag = chatRoomId;
    notificationOptions.renotify = true;
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  const url = event.notification.data?.url || '/';
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

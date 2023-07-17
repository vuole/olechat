// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBa_y8vDNf6PVOw1qlEZgKSq2RKTm7JmTY",
  authDomain: "olechat-f8ab7.firebaseapp.com",
  projectId: "olechat-f8ab7",
  storageBucket: "olechat-f8ab7.appspot.com",
  messagingSenderId: "115606345392",
  appId: "1:115606345392:web:c304f5a63ed9bd69aacd75",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
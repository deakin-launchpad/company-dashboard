/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCUWd5ZmYfRxH3TvwwcZKzfvmJ8GfhQNOI",
  authDomain: "company-application-a5a71.firebaseapp.com",
  projectId: "company-application-a5a71",
  storageBucket: "company-application-a5a71.appspot.com",
  messagingSenderId: "987099544772",
  appId: "1:987099544772:web:45b35ef039747ddd181d91",
  measurementId: "G-2HBZKSRXZ8",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyCUWd5ZmYfRxH3TvwwcZKzfvmJ8GfhQNOI",
  authDomain: "company-application-a5a71.firebaseapp.com",
  projectId: "company-application-a5a71",
  storageBucket: "company-application-a5a71.appspot.com",
  messagingSenderId: "987099544772",
  appId: "1:987099544772:web:45b35ef039747ddd181d91",
  measurementId: "G-2HBZKSRXZ8",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    return;
  }
}

export async function fetchToken(setTokenFound) {
  try {
    requestPermission();
    const token = await getToken(messaging, {
      vapidKey: process.env.FIREBASE_WEB_PUSH_KEY,
    });
    setTokenFound(token);
    return token;
  } catch (error) {
    setTokenFound("Missing Token");
    console.log(error);
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

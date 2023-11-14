import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyCr2jmgu37IZ8GxsaMdEJ9GothFbK-We90",
  authDomain: "company-finance-d8861.firebaseapp.com",
  projectId: "company-finance-d8861",
  storageBucket: "company-finance-d8861.appspot.com",
  messagingSenderId: "1067828391977",
  appId: "1:1067828391977:web:f1bb2da8106e6adda72c38",
  measurementId: "G-1BYSFVVMGK"
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

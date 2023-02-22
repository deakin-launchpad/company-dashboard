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

export const fetchToken = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey: process.env.FIREBASE_WEB_PUSH_KEY,
  })
    .then((currentToken) => {
      if (currentToken) {
        setTokenFound(currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

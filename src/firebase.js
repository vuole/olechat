// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa_y8vDNf6PVOw1qlEZgKSq2RKTm7JmTY",
  authDomain: "olechat-f8ab7.firebaseapp.com",
  projectId: "olechat-f8ab7",
  storageBucket: "olechat-f8ab7.appspot.com",
  messagingSenderId: "115606345392",
  appId: "1:115606345392:web:c304f5a63ed9bd69aacd75",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
export const messaging = getMessaging(app);

export const getToken1 = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      "BLHBPCSuF1J3VgBD6SM9QgeM9lSp77yB1N2Se2inVHAFEo5i5oenQa9TPRdwcqsTt7CAw4hhXEHAyDJvxmJUzaI",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

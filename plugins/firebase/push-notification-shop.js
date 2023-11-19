/*
 * Copyright (c) 2023. Selldone® Business OS™
 *
 * Author: M.Pajuhaan
 * Web: https://selldone.com
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
 * From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
 * Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
 * Our journey is not just about reaching a destination, but about creating a masterpiece.
 * Tread carefully, for you're treading on dreams.
 */

import { initializeApp } from "firebase/app";

import {
  getMessaging,
  onMessage,
  getToken,
  isSupported,
} from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import {EventName} from "@core/events/EventBus";

const firebaseConfig = {
  apiKey: "{!! enter here e.g. AIzaSyBlMGghN...!!}",
  projectId: "{!! enter here e.g. selld...!!}",
  appId: "{!!enter here e.g 1:772774756...!!}",
  measurementId: "{!!enter here e.g. G30400567!!}", // Replace by shop tag manager ID!
};

const firebaseApp = initializeApp(firebaseConfig);

// Analytics:
const analytics = getAnalytics();

export class PushNotification {
  static EventBus = null;
  messaging = null;

  constructor(EventBus) {
    PushNotification.EventBus = EventBus;

    // Messaging:
    if (isSupported()) {
      this.initializeMessaging();
    }
  }

  initializeMessaging() {
    if (!navigator.serviceWorker) {
      // Private window mode or ...
      console.error("Messaging service is disable! Private window mode or ...");
      return;
    }

    // Retrieve Firebase Messaging object:
    const messaging = getMessaging();

    /*
    navigator.serviceWorker
      .register("/app/firebase-messaging-sw.js")
      .then(registration => {
        messaging.useServiceWorker(registration);

        // Get Token:
        PushNotification.GetToken();
      });*/

    console.log("⏺ Register message listener..");

    onMessage(messaging, (payload) => {
      //console.log("Message received - Foreground. ", payload);
      PushNotification.EventBus.$emit(EventName.FIREBASE_RECEIVE_MESSAGE, payload);
    });
    /*
    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then(refreshedToken => {
          console.log("Token refreshed.");
          // Indicate that the new Instance ID token has not yet been sent to the
          // app server.
          // Send Instance ID token to app server.
          PushNotification.EventBus.$emit(EventName.FIREBASE_GET_TOKEN, refreshedToken);

          // ...
        })
        .catch(err => {
          console.log("Unable to retrieve refreshed token ", err);
        });
    });*/

    // Get Token:
    PushNotification.GetToken();
  }

  static AskForPermission() {
    try {
      if (!isSupported()) return;
      Notification?.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");

          PushNotification.GetToken();
        } else {
          console.log("Unable to get permission to notify.");
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  static GetToken() {
    // Retrieve Firebase Messaging object:
    const messaging = getMessaging();

    console.log("⚙ Service worker Get token (static).");

    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.

    getToken(messaging, {
      vapidKey:
        "{!!enter here e.g BOAPKP--XYZ...!!}",
    })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          PushNotification.EventBus.$emit(EventName.FIREBASE_GET_TOKEN, currentToken);
        } else {
          // Show permission request UI
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });

    /*

    // subsequent calls to getToken will return from cache.
    messaging
      .getToken()
      .then(currentToken => {
        if (currentToken) {
          //console.log("token :", currentToken);
          PushNotification.EventBus.$emit(EventName.FIREBASE_GET_TOKEN, currentToken);
        } else {
          // Show permission request.
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
          // Show permission UI.
        }
      })
      .catch(err => {
        console.log("An error occurred while retrieving token. ", err);
      });*/
  }
}

/*
export const askForPermissionToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await Notification.requestPermission();
    const token = await messaging.getToken();
    console.log("token :", token);

    return token;
  } catch (error) {
    console.error(error);
  }
};*/

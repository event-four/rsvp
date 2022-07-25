import NextAuth from "next-auth";
// import Providers from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQDP7RmKv7QVN926tXevm3J2LPCkxBAh0",
  authDomain: "eventfour-1ea7e.firebaseapp.com",
  projectId: "eventfour-1ea7e",
  storageBucket: "eventfour-1ea7e.appspot.com",
  messagingSenderId: "6881914388",
  appId: "1:6881914388:web:50a1cd43d1d8adfc9fc101",
  measurementId: "G-3HCEFX3NQG",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
const auth = getAuth();

const providers = [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: {
        label: "Email",
        type: "text",
        placeholder: "Enter Email Address",
        value: "abc@demo.com",
      },
      password: {
        label: "Password",
        type: "password",
        placeholder: "Enter Password",
        value: "000000",
      },
    },
    async authorize(credentials, req) {
      return signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
        .then(async (userCredential) => {
          const fbUser = userCredential.user;
          const idToken = await fbUser.getIdToken();
          const result = await getTokenFromYourAPIServer(idToken);

          if (!result) {
            console.log("Error signing in to server!");
            return null;
          }
          const user = {
            ...result.data.user,
            profile: result.data.user_profile,
            jwt: result.data.jwt,
          };

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;
          }
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);

          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          return null;
        });
    },
  }),
  GoogleProvider({
    clientId:
      "6881914388-fudc9b97g1girgfhehhia0f8nimdm3p5.apps.googleusercontent.com", // process.env.GOOGLE_ID,
    clientSecret: "YD2Yanr7glynAkH1EWrzNcws", // process.env.GOOGLE_SECRET,
  }),
];
const adapters = [];
const callbacks = {};

callbacks.jwt = async function jwt(token, user) {
  console.log("here");
  if (user) {
    token = { accessToken: user.jwt };
  }

  return token;
};

callbacks.session = async function session(session, token) {
  console.log("here 2");

  session.accessToken = token.accessToken;
  session.user = user;
  return session;
};

const options = {
  secret: "NkJb8xuYRwCZ46vc3SEw1Ojmwq2W0BHqkeBZ33Pe9n0=",
  providers,
  adapters,
  //   callbacks,
};

async function getTokenFromYourAPIServer(idToken) {
  console.log(idToken);
  const res = await fetch("http://localhost:1337/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: idToken }),
  });

  const result = await res.json();

  return result;
}

export default (req, res) => NextAuth(req, res, options);

import NextAuth from "next-auth";
// import Providers from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { userService } from "/services";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

// const firebaseConfig =
//   process.env.NODE_ENV === "development"
//     ? {
//         apiKey: "AIzaSyCQDP7RmKv7QVN926tXevm3J2LPCkxBAh0",
//         authDomain: "eventfour-1ea7e.firebaseapp.com",
//         projectId: "eventfour-1ea7e",
//         storageBucket: "eventfour-1ea7e.appspot.com",
//         messagingSenderId: "6881914388",
//         appId: "1:6881914388:web:50a1cd43d1d8adfc9fc101",
//         measurementId: "G-3HCEFX3NQG",
//       }
//     : {
//         apiKey: "AIzaSyCxLWVA1DxY23IOG4ljhAJ6VMqYWH3OIPs",
//         authDomain: "eventfour-prod.firebaseapp.com",
//         projectId: "eventfour-prod",
//         storageBucket: "eventfour-prod.appspot.com",
//         messagingSenderId: "961417591581",
//         appId: "1:961417591581:web:3d97e3b1f0ce0cb2e17ff4",
//         measurementId: "G-H7X66BSRXW",
//       };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

export const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
export const auth = getAuth();

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
          const result = await userService.login(fbUser.accessToken);

          if (!result) {
            console.log("Error signing in to server!");
            return null;
          }

          const user = {
            ...result.data.user,
            profile: result.data.user_profile,
            jwt: result.data.jwt,
            event: result.data.event,
          };

          await userService.setUser(user);

          if (user) {
            // console.log(user);
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
          console.log(error);

          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          throw error;
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

callbacks.jwt = async function jwt({ token, user }) {
  // console.log("here", user);
  if (user) {
    token.jwt = user.jwt;
    token.user = user;
  }

  return token;
};

callbacks.session = async function session({ session, token, user }) {
  // console.log("here 2 token", token);
  // console.log("here 2", user);
  session.jwt = token.jwt;
  session.user = token.user;
  return session;
};

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  adapters,
  callbacks,
};

export default (req, res) => NextAuth(req, res, authOptions);

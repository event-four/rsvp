import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { urls } from "/helpers";

const auth = getAuth();

const signUp = async ({ email, password }) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      const token = userCredential.user.accessToken;
      return { user: user, token: token };
    })
    .catch((error) => {
      throw error;
    });
};

async function setupAccountOnServer(data) {
  return await createUserAccountOnAPI(data)
    .then((result) => {
      return {
        ...result.data.user,
        profile: result.data.user_profile,
        jwt: result.data.jwt,
        // event: result.data.event,
      };
    })
    .catch((error) => {
      throw error;
    });
}

async function createUserAccountOnAPI(data) {
  const payload = data;
  console.log(payload);
  const res = await fetch(urls.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error.error;
  }

  const result = await res.json();

  return result;
}

async function setupEventOnServer({ jwt, eventMeta }) {
  const payload = eventMeta;
  console.log(payload);
  const res = await fetch(urls.event, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify({ data: payload }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error.error;
  }

  const result = await res.json();

  return result.data;
}

export { signUp, setupAccountOnServer, setupEventOnServer };

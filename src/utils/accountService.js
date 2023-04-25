// import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

// const accountSubject = new BehaviorSubject(null);

export const accountService = {
  apiAuthenticate,
};

function generateJwtToken(data) {
  // create token that expires in 15 minutes
  const tokenPayload = {
    exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
    id: data.id,
  };
  return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
}

async function authenticate(accessToken) {
  return await axios.get(
    `https://graph.facebook.com/v15.0/me?access_token=${accessToken}`
  );
}

function apiAuthenticate(accessToken) {
  // authenticate with the api using a facebook access token,
  // on success the api returns an account object with a JWT auth token
  const account = authenticate(accessToken).then((response) => {
    const { data } = response;
    // if (data.error) return { error: 401, data: data.error.message };

    return {
      ...data,
      token: generateJwtToken(data),
    };
  });
  // accountSubject.next(account);
  // startAuthenticateTimer();
  return account;
}

// const startAuthenticateTimer = () => {
//   // parse json object from base64 encoded jwt token
//   const jwtToken = JSON.parse(atob(accountSubject.value.token.split('.')[1]));

//   // set a timeout to re-authenticate with the api one minute before the token expires
//   const expires = new Date(jwtToken.exp * 1000);
//   const timeout = expires.getTime() - Date.now() - 60 * 1000;
//   const { accessToken } = window.FB.getAuthResponse();
//   setTimeout(() => apiAuthenticate(accessToken), timeout);
// };

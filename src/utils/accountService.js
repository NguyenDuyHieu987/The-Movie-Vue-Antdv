// import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

// const accountSubject = new BehaviorSubject(null);

export const accountService = {
  apiAuthenticate,
};

function generateJwtToken(data) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const encodedHeaders = btoa(JSON.stringify(header));

  const tokenPayload = {
    exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
    id: data.id,
  };
  const encodedPlayload = btoa(JSON.stringify(tokenPayload));

  const crypto = require('crypto');
  const hmac = crypto.createHash('sha256', 'mysecret');

  const payload = hmac.update(`${encodedHeaders}.${encodedPlayload}`);
  const signature = payload.digest('hex');

  const encodedSignature = btoa(signature);

  const jwt = `${encodedHeaders}.${encodedPlayload}.${encodedSignature}`;

  return jwt;
}

async function authenticateFacebook(accessToken) {
  return await axios
    .get(
      `https://graph.facebook.com/v15.0/me?access_token=${accessToken}&fields=id,name,email,picture`
    )
    .then((response) => {
      const { data } = response;
      // if (data.error) return { error: 401, data: data.error.message };

      return {
        ...data,
        token: generateJwtToken(data),
      };
    });
}

function apiAuthenticate(accessToken) {
  // authenticate with the api using a facebook access token,
  // on success the api returns an account object with a JWT auth token
  const account = authenticateFacebook(accessToken);
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

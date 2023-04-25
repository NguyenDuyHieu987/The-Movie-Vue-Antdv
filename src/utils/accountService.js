import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

const accountSubject = new BehaviorSubject(null);

export const accountService = {
  apiAuthenticate,
};

const apiAuthenticate = async (accessToken) => {
  // authenticate with the api using a facebook access token,
  // on success the api returns an account object with a JWT auth token
  const response = await axios.post(
    `http://localhost:8080/accounts/authenticate`,
    {
      accessToken,
    }
  );
  const account = response.data;
  accountSubject.next(account);
  startAuthenticateTimer();
  return account;
};

const startAuthenticateTimer = () => {
  // parse json object from base64 encoded jwt token
  const jwtToken = JSON.parse(atob(accountSubject.value.token.split('.')[1]));

  // set a timeout to re-authenticate with the api one minute before the token expires
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - 60 * 1000;
  const { accessToken } = window.FB.getAuthResponse();
  setTimeout(() => apiAuthenticate(accessToken), timeout);
};

import axios from 'axios';

export const accountService = {
  apiAuthenticate,
};

async function authenticateFacebook(accessToken) {
  return await axios
    .get(
      `https://graph.facebook.com/v15.0/me?access_token=${accessToken}&fields=id,name,email,picture`
    )
    .then(async (response) => {
      const { data } = response;

      return {
        ...data,
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

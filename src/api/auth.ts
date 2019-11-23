import axios from 'axios';

// FIXME it seems we don't need axios
export const apiRequest = axios.create({
  // FIXME use env var
  baseURL: 'http://127.0.0.1:3000',
});

export const authenticate = async wallet => {
  // FIXME if we have a token, check expiry date and maybe just use that
  // FIXME error handling
  const {
    data: { challenge },
  } = await apiRequest.post('/auth/challenge', {
    address: wallet.address,
  });
  const signature = await wallet.signMessage({ message: challenge });
  const {
    data: { token },
  } = await apiRequest.post('/auth/token', {
    challenge,
    signature,
  });
  apiRequest.defaults.headers.common.Authorization = `Bearer ${token}`;

  // FIXME abstraction???
  localStorage.setItem('token', token);
  console.log(token);
  return token;
};

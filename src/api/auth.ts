import jwtDecode from 'jwt-decode';

const TOKEN_STORAGE = 'colony-server-token';

const postRequest = async (path: string, data: object) => {
  const response = await fetch(`${process.env.SERVER_ENDPOINT}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_STORAGE, token);
export const getToken = () => localStorage.getItem(TOKEN_STORAGE);
export const clearToken = () => localStorage.removeItem(TOKEN_STORAGE);

export const authenticate = async wallet => {
  const token = getToken();
  if (token) {
    const tokenData = jwtDecode(token);
    // JWT expiry dates are noted in seconds
    if (tokenData.exp * 10 ** 3 > Date.now()) return token;
  }
  const { challenge } = await postRequest('/auth/challenge', {
    address: wallet.address,
  });
  const signature = await wallet.signMessage({ message: challenge });
  const { token: refreshedToken } = await postRequest('/auth/token', {
    challenge,
    signature,
  });
  setToken(refreshedToken);
  return refreshedToken;
};

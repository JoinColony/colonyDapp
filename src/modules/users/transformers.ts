import { AnyUser } from '~data/index';

export const getFriendlyName = (user?: AnyUser | string) => {
  if (!user) return '';
  if (typeof user === 'string') return user;
  const { displayName, username, walletAddress } = user.profile;
  return displayName || username || walletAddress;
};

export const getUsername = (user?: AnyUser) => {
  if (!user) return '';
  return user.profile.username;
};

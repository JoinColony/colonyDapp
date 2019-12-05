import { User } from '~data/index';

export const getFriendlyName = (user?: User | string) => {
  if (!user) return '';
  if (typeof user === 'string') return user;
  const { displayName, username, walletAddress } = user.profile;
  return displayName || username || walletAddress;
};

export const getUsername = (user?: User) => {
  if (!user) return '';
  return user.profile.username;
};

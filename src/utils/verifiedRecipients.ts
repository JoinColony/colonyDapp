import { AnyUser } from '~data/index';

export const getVerifiedUsers = (
  verifiedAddresses: string[],
  subscribedUsers: AnyUser[],
) => {
  if (verifiedAddresses.length === 0) {
    return undefined;
  }
  return subscribedUsers.filter((member) =>
    verifiedAddresses.some(
      (el) => el.toLowerCase() === member.id.toLowerCase(),
    ),
  );
};

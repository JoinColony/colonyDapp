import { AnyUser } from '~data/index';

/*
Extracts the required values to be used in the SingleUserPicker
on selection
*/
export const filterUserSelection = (data: AnyUser[], filterValue: string) => {
  if (!filterValue) {
    return data;
  }

  const filtered = data.filter((user) => {
    const { username, walletAddress } = user?.profile;
    const valueToLowerCase = filterValue.toLowerCase();
    return (
      username &&
      walletAddress &&
      (`@${username}`.toLowerCase().includes(valueToLowerCase) ||
        walletAddress.toLowerCase().includes(valueToLowerCase))
    );
  });

  const customUserValue: AnyUser = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customUserValue].concat(filtered);
};

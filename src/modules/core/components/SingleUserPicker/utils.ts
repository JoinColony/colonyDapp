import { AnyUser } from '~data/index';

/*
Extracts the required values to be used in the SingleUserPicker
on selection
*/
export const filterUserSelection = (data: AnyUser[], filterValue: string) => {
  if (!filterValue) {
    return data;
  }

  const filteredUsers = data.filter((user) => {
    const username = user.profile?.username || '';
    const walletAddress = user.profile?.walletAddress || '';

    return (
      username.toLowerCase().includes(filterValue.toLowerCase()) ||
      walletAddress.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.id.toLowerCase().includes(filterValue.toLowerCase())
    );
  });

  const customUserValue: AnyUser = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customUserValue].concat(filteredUsers);
};

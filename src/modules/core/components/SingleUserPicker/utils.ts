/*
Extracts the required values to be used in the SingleUserPicker
on selection
*/
export const filterUserSelection = (data, filterValue) => {
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

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};

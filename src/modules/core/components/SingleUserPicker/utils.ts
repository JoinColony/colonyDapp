/*
Extracts the required values to be used in the SingleUserPicker
on selection
*/
export const filterUserSelection = (data, filterValue) => {
  if (!filterValue) {
    return data;
  }

  const filtered = data.filter(
    (user) =>
      user &&
      user.profile &&
      user.profile.username &&
      filterValue &&
      (user.profile.username
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
        user.profile.walletAddress
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        user.id.toLowerCase().includes(filterValue.toLowerCase())),
  );

  const customValue = {
    id: 'filterValue',
    profile: {
      walletAddress: filterValue,
      displayName: filterValue,
    },
  };

  return [customValue].concat(filtered);
};

export const filterMembers = (data, filterValue) => {
  if (!filterValue) {
    return data;
  }

  return data.filter(
    (member) =>
      member &&
      member.profile &&
      member.profile.username &&
      filterValue &&
      (member.profile.username
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ||
        member.profile.walletAddress
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        member.id.toLowerCase().includes(filterValue.toLowerCase())),
  );
};

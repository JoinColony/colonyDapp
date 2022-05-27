export const filterMembers = (
  data: ColonyContributor[] | ColonyWatcher[],
  filterValue: string,
) => {
  if (!filterValue) {
    return data;
  }

  return data.filter(
    (member) =>
      member?.profile?.username
        ?.toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      member?.profile?.walletAddress
        ?.toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      member?.id?.toLowerCase().includes(filterValue.toLowerCase()),
  );
};

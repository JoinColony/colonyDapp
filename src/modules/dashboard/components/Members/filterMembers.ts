import { ColonyContributor, ColonyWatcher } from '~data/index';

export const filterMembers = <M extends ColonyContributor | ColonyWatcher>(
  data: M[],
  filterValue: string,
): M[] => {
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

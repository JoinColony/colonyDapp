import { MEMEBERS_FILTERS } from '~dashboard/ColonyMembers/MembersFilter';

import { ColonyContributor, ColonyWatcher } from '~data/index';

export const filterMembers = <M extends ColonyContributor | ColonyWatcher>(
  data: M[],
  filterValue?: string,
  filtersList?: MEMEBERS_FILTERS[],
): M[] => {
  const excludeBanned = !filtersList?.includes(MEMEBERS_FILTERS.BANNED);
  const excludeVerified = !filtersList?.includes(MEMEBERS_FILTERS.VERIFIED);

  /* No filters */
  if (!filterValue && !excludeBanned && !excludeVerified) {
    return data;
  }

  /* Only text filter */
  if (filterValue && !excludeBanned && !excludeVerified) {
    return data.filter(
      ({ profile, id }) =>
        profile?.username?.toLowerCase().includes(filterValue.toLowerCase()) ||
        profile?.walletAddress
          ?.toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        id?.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }

  /* Only checkbox filters */
  if (!filterValue) {
    return data.filter(({ banned, isWhitelisted }) => {
      if (excludeBanned && excludeVerified) {
        return !banned && !isWhitelisted;
      }

      if (excludeBanned) {
        return !banned;
      }

      return !isWhitelisted;
    });
  }

  /* All the filters together */
  return data.filter(({ banned, isWhitelisted, profile, id }) => {
    const textFilter =
      profile?.username?.toLowerCase().includes(filterValue?.toLowerCase()) ||
      profile?.walletAddress
        ?.toLowerCase()
        .includes(filterValue?.toLowerCase()) ||
      id?.toLowerCase().includes(filterValue?.toLowerCase());

    if (excludeBanned && excludeVerified) {
      return !banned && !isWhitelisted && textFilter;
    }

    if (excludeBanned) {
      return !banned && textFilter;
    }

    return !isWhitelisted && textFilter;
  });
};

import {
  FormValues,
  BannedStatus,
  VerificationType,
} from '~dashboard/ColonyMembers/MembersFilter';

import { ColonyContributor, ColonyWatcher } from '~data/index';

export const filterMembers = <M extends ColonyContributor | ColonyWatcher>(
  data: M[],
  searchValue?: string,
  filters?: FormValues,
): M[] => {
  /* No filters */
  if (
    !searchValue &&
    filters?.bannedStatus === BannedStatus.ALL &&
    filters?.verificationType === VerificationType.ALL
  ) {
    return data;
  }

  /* Only text filter */
  if (
    searchValue &&
    filters?.bannedStatus === BannedStatus.ALL &&
    filters?.verificationType === VerificationType.ALL
  ) {
    return data.filter(
      ({ profile, id }) =>
        profile?.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
        profile?.walletAddress
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        id?.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  /* All other combinations */
  return data.filter(({ banned, isWhitelisted, profile, id }) => {
    const textFilter =
      searchValue === undefined || searchValue === ''
        ? true
        : profile?.username
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          profile?.walletAddress
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          id?.toLowerCase().includes(searchValue.toLowerCase());

    if (filters?.verificationType === VerificationType.ALL) {
      if (filters?.bannedStatus === BannedStatus.BANNED) {
        return banned && textFilter;
      }

      if (filters?.bannedStatus === BannedStatus.NOT_BANNED) {
        return !banned && textFilter;
      }
    }

    if (filters?.bannedStatus === BannedStatus.ALL) {
      if (filters.verificationType === VerificationType.VERIFIED) {
        return isWhitelisted && textFilter;
      }

      if (filters.verificationType === VerificationType.UNVERIFIED) {
        return !isWhitelisted && textFilter;
      }
    }

    if (
      filters?.verificationType === VerificationType.VERIFIED &&
      filters?.bannedStatus === BannedStatus.BANNED
    ) {
      return isWhitelisted && banned && textFilter;
    }

    if (
      filters?.verificationType === VerificationType.UNVERIFIED &&
      filters?.bannedStatus === BannedStatus.BANNED
    ) {
      return !isWhitelisted && banned && textFilter;
    }

    if (
      filters?.verificationType === VerificationType.VERIFIED &&
      filters?.bannedStatus === BannedStatus.NOT_BANNED
    ) {
      return isWhitelisted && !banned && textFilter;
    }

    return !isWhitelisted && !banned && textFilter;
  });
};

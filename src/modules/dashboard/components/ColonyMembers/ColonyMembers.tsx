import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { AddressZero } from 'ethers/constants';

import { useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  DEFAULT_TOKEN_DECIMALS,
} from '~constants';

import LoadingTemplate from '~pages/LoadingTemplate';
import Members from '~dashboard/Members';
import WrongNetworkDialog from '~dashboard/ColonyHome/WrongNetworkDialog';
import InviteLinkButton from '~dashboard/InviteLinkButton';
import { MEMEBERS_FILTERS } from '~dashboard/ColonyMembers/MembersFilter';

import {
  useColonyFromNameQuery,
  useLoggedInUser,
  useUserReputationQuery,
} from '~data/index';
import { getFormattedTokenValue } from '~utils/tokens';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import MembersFilter from './MembersFilter';
import MemberControls from './MemberControls';
import styles from './ColonyMembers.css';

const displayName = 'dashboard.ColonyMembers';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.ColonyMembers.loadingText',
    defaultMessage: 'Loading Colony',
  },
  totalReputationTitle: {
    id: 'dashboard.ColonyMembers.totalReputationTitle',
    defaultMessage: 'Total reputation in team',
  },
});

const ColonyMembers = () => {
  const [filters, setFilters] = useState<MEMEBERS_FILTERS[]>([]);

  const { networkId, ethereal } = useLoggedInUser();
  const { domainId } = useParams<{
    domainId: string;
  }>();
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const openWrongNetworkDialog = useDialog(WrongNetworkDialog);

  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData, error, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
    pollInterval: 5000,
  });

  const colonyAddress = colonyData?.processedColony?.colonyAddress || '';

  useEffect(() => {
    if (!ethereal && !isNetworkAllowed) {
      openWrongNetworkDialog();
    }
  }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  const [selectedDomainId, setSelectedDomainId] = useState<number>(
    /*
     * @NOTE DomainId param sanitization
     *
     * We don't actually need to worry about sanitizing the domainId that's
     * coming in from the params.
     * The value that reaches us through the hook is being processes by `react-router`
     * and will always be a string.
     *
     * So if we can change that string into a number, we use it as domain, otherwise
     * we fall back to the "All Domains" selection
     */
    parseInt(domainId, 10) || COLONY_TOTAL_BALANCE_DOMAIN_ID,
  );

  const isRootDomain = useMemo(
    () =>
      selectedDomainId === ROOT_DOMAIN_ID ||
      selectedDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    [selectedDomainId],
  );

  const { data: totalReputation } = useUserReputationQuery({
    variables: {
      address: AddressZero,
      colonyAddress,
      domainId: selectedDomainId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const nativeToken = colonyData?.processedColony?.tokens.find(
    ({ address }) =>
      address === colonyData?.processedColony?.nativeTokenAddress,
  );

  const formattedTotalDomainRep = getFormattedTokenValue(
    new Decimal(totalReputation?.userReputation || '0').abs().toString(),
    nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  if (
    loading ||
    (colonyData?.colonyAddress &&
      !colonyData.processedColony &&
      !((colonyData.colonyAddress as any) instanceof Error))
  ) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (!colonyName || error || !colonyData?.processedColony) {
    console.error(error);
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          {colonyData && colonyData.processedColony && (
            <Members
              selectedDomain={selectedDomainId}
              handleDomainChange={setSelectedDomainId}
              filters={filters}
              colony={colonyData?.processedColony}
            />
          )}
        </div>
        <aside className={styles.rightAside}>
          <div className={styles.teamReputationPointsContainer}>
            <Heading
              text={MSG.totalReputationTitle}
              appearance={{ size: 'normal', theme: 'dark' }}
            />
            <p className={styles.reputationPoints}>
              <Numeral
                value={formattedTotalDomainRep}
                suffix="reputation points"
              />
            </p>
          </div>
          <ul className={styles.controls}>
            {isRootDomain && (
              <li>
                <InviteLinkButton
                  colonyName={colonyName}
                  buttonAppearance={{ theme: 'blue' }}
                />
              </li>
            )}
            <MemberControls colony={colonyData?.processedColony} />
          </ul>
          <MembersFilter
            handleFiltersCallback={setFilters}
            isRoot={isRootDomain}
          />
        </aside>
      </div>
    </div>
  );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;

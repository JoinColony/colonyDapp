import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import Heading from '~core/Heading';
import InfoPopover from '~core/InfoPopover';
import NavLink from '~core/NavLink';

import {
  useLoggedInUser,
  Colony,
  useTokenBalancesForDomainsQuery,
} from '~data/index';
import { useTransformer } from '~utils/hooks';
import { canFund } from '../../../../users/checks';
import { getAllUserRoles } from '../../../../transformers';

import TokenItem from './TokenItem';

import styles from './ColonyFunding.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonyFunding.title',
    defaultMessage: 'Available funds',
  },
});

interface Props {
  colony: Colony;
  currentDomainId: number;
}

const displayName = 'dashboard.ColonyHome.ColonyFunding';

const ColonyFunding = ({ colony, currentDomainId }: Props) => {
  const { walletAddress, ethereal, username } = useLoggedInUser();

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const canMoveFunds = !!username && !ethereal && canFund(allUserRoles);

  const {
    colonyAddress,
    tokens: colonyTokens,
    nativeTokenAddress,
    colonyName,
    isNativeTokenLocked,
  } = colony;

  const {
    data,
    loading: isLoadingTokenBalances,
  } = useTokenBalancesForDomainsQuery({
    variables: {
      colonyAddress,
      domainIds: [currentDomainId],
      tokenAddresses: colonyTokens.map(({ address }) => address),
    },
    fetchPolicy: 'network-only',
  });

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        {canMoveFunds ? (
          <NavLink to={`/colony/${colonyName}/funds`}>
            <FormattedMessage {...MSG.title} />
          </NavLink>
        ) : (
          <FormattedMessage {...MSG.title} />
        )}
      </Heading>
      {data && !isLoadingTokenBalances ? (
        <ul>
          {data.tokens.map((token) => (
            <li key={token.address}>
              <InfoPopover
                token={token}
                isTokenNative={token.address === nativeTokenAddress}
              >
                <div className={styles.tokenBalance}>
                  <TokenItem
                    currentDomainId={currentDomainId}
                    token={token}
                    isTokenNative={token.address === nativeTokenAddress}
                    isNativeTokenLocked={isNativeTokenLocked}
                  />
                </div>
              </InfoPopover>
            </li>
          ))}
        </ul>
      ) : (
        <SpinnerLoader />
      )}
    </div>
  );
};

ColonyFunding.displayName = displayName;

export default ColonyFunding;

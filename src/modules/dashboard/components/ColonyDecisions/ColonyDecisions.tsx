import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Select, Form } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';

import { Colony } from '~data/index';

import { SortOptions, SortSelectOptions } from './constants';
import styles from './ColonyDecisions.css';

const MSG = defineMessages({
  decisionsTitle: {
    id: 'dashboard.ColonyDecisions.decisionsTitle',
    defaultMessage: 'Decisions',
  },
  labelFilter: {
    id: 'dashboard.ColonyDecisions.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.ColonyDecisions.placeholderFilter',
    defaultMessage: 'Filter',
  },
  noDecisionsFound: {
    id: 'dashboard.ColonyDecisions.noDecisionsFound',
    defaultMessage: 'No decisions exist',
  },
  loading: {
    id: 'dashboard.ColonyDecisions.loading',
    defaultMessage: 'Loading decisions',
  },
});

type Props = {
  colony: Colony;
  /*
   * @NOTE Needed for filtering based on domain
   */
  ethDomainId?: number;
};

/* temp data */
const data = [
  {
    id: `0xeabe562c979679dc4023dd23e8c6aa782448c2e7_motion_0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_2`,
    initiator: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
    recipient: '0x0000000000000000000000000000000000000000',
    title: 'I want to add dark mode to the Dapp',
    motionState: 'Passed',
    isDecision: true,
    motionId: '2',
    createdAt: new Date(
      'Sun Aug 17 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
  },
  {
    title: 'Update the logo design',
    isDecision: true,
    actionType: undefined,
    amount: '0',
    blockNumber: 853,
    commentCount: 0,
    createdAt: new Date(
      'Sun Aug 14 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
    decimals: '18',
    fromDomain: '1',
    id: `0xeabe562c979679dc4023dd23e8c6aa782448c2e7_motion_0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_1`,
    initiator: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
    motionId: '1',
    motionState: 'Staking',
    recipient: '0x0000000000000000000000000000000000000000',
    reputationChange: '0',
    requiredStake: '1010101010101010101',
    status: undefined,
    symbol: '???',
    timeoutPeriods: undefined,
    toDomain: '1',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    totalNayStake: '0',
    transactionHash:
      '0x9c742b1392fadb48c0bc0d2cebdd518e7b11c0c1ab426c084a06c68ea77f8f70',
    transactionTokenAddress: undefined,
  },
  {
    title: 'Update the actions design',
    isDecision: true,
    actionType: undefined,
    amount: '0',
    blockNumber: 853,
    commentCount: 0,
    createdAt: new Date(
      'Sun Aug 18 2022 12:48:59 GMT+0300 (Eastern European Summer Time)',
    ),
    decimals: '18',
    fromDomain: '2',
    id: `0xeabe562c979679dc4023dd23e8c6aa782448c2e7_motion_0xa1e73506f3ef6dc19dc27b750adf585fd0f30c63_3`,
    initiator: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
    motionId: '1',
    motionState: 'Staked',
    recipient: '0x0000000000000000000000000000000000000000',
    reputationChange: '0',
    requiredStake: '1010101010101010101',
    status: undefined,
    symbol: '???',
    timeoutPeriods: undefined,
    toDomain: '2',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    totalNayStake: '0',
    transactionHash:
      '0x9c742b1392fadb48c0bc0d2cebdd518e7b11c0c1ab426c084a06c68ea77f8f70',
    transactionTokenAddress: undefined,
  },
];

const ColonyDecisions = ({
  colony,
  colony: { colonyName },
  ethDomainId,
}: Props) => {
  // temp values, to be removed when queries are wired in
  const isLoading = false;

  const history = useHistory();

  const handleActionRedirect = useCallback(
    ({ transactionHash }: RedirectHandlerProps) =>
      history.push(`/colony/${colonyName}/tx/${transactionHash}`),
    [colonyName, history],
  );

  const filteredDecisions = useMemo(
    () =>
      !ethDomainId || ethDomainId === ROOT_DOMAIN_ID
        ? data
        : data.filter(
            (item) =>
              item.toDomain === ethDomainId.toString() ||
              item.fromDomain === ethDomainId.toString() ||
              /* when no specific domain in the action it is displayed in Root */
              (ethDomainId === ROOT_DOMAIN_ID && item.fromDomain === undefined),
          ),
    [ethDomainId],
  );

  if (isLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  return (
    <div>
      {data.length > 0 ? (
        <>
          <div className={styles.bar}>
            <div className={styles.title}>
              <FormattedMessage {...MSG.decisionsTitle} />
            </div>
            <Form
              initialValues={{ filter: SortOptions.ENDING_SOONEST }}
              onSubmit={() => undefined}
            >
              <div className={styles.filter}>
                <Select
                  appearance={{ alignOptions: 'left', theme: 'alt' }}
                  elementOnly
                  label={MSG.labelFilter}
                  name="filter"
                  options={SortSelectOptions}
                  placeholder={MSG.placeholderFilter}
                />
              </div>
            </Form>
          </div>
          <ActionsList
            items={filteredDecisions}
            handleItemClick={handleActionRedirect}
            colony={colony}
          />
        </>
      ) : (
        <div className={styles.emptyState}>
          <FormattedMessage {...MSG.noDecisionsFound} />
        </div>
      )}
    </div>
  );
};

export default ColonyDecisions;

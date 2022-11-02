import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import { CollapseExpandButtons } from '~dashboard/ExpenditurePage/Payments';
import { Colony } from '~data/index';

import LockedFundingSource from './LockedFundingSource';
import { FundingSource } from './types';
import styles from './Streaming.css';

const MSG = defineMessages({
  fundingSource: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.fundingSource',
    defaultMessage: 'Funding source',
  },
  title: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.title',
    defaultMessage: `{counter}: {team}, {rate} {tokens}`,
  },
  rate: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.rate',
    defaultMessage: `{amount} {token} / {time}{comma}`,
  },
  itemName: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.itemName',
    defaultMessage: `funding Source`,
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.LockedStreaming';

interface Props {
  fundingSources?: FundingSource[];
  colony: Colony;
}

const LockedStreaming = ({ fundingSources, colony }: Props) => {
  const [openItemsIds, setOpenItemsIds] = useState<string[]>(
    fundingSources?.map(({ id }) => id) || [],
  );

  const { formatMessage } = useIntl();

  const onToggleButtonClick = useCallback((id) => {
    setOpenItemsIds((expandedIds) => {
      const isOpen = expandedIds?.find((expanded) => expanded === id);

      return isOpen
        ? expandedIds?.filter((expandedId) => expandedId !== id)
        : [...(expandedIds || []), id];
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FormattedMessage {...MSG.fundingSource} />
      </div>
      {fundingSources?.map((fundingSource, index) => {
        const domain = colony?.domains.find(
          ({ ethDomainId }) => Number(fundingSource.team) === ethDomainId,
        );
        const isOpen = !!openItemsIds?.find((id) => id === fundingSource.id);

        const { amount, token, time } = fundingSource.rates?.[0] || {};
        const tokenData = colony.tokens?.find(
          (tokenItem) => token && tokenItem.address === token,
        );

        return (
          <div
            className={classNames(styles.singleFundingSource, {
              [styles.marginBottomLarge]: isOpen,
            })}
            key={fundingSource.id}
          >
            <FormSection>
              <div className={styles.fundingSourceLabel}>
                <CollapseExpandButtons
                  isExpanded={isOpen}
                  onToogleButtonClick={() =>
                    onToggleButtonClick(fundingSource.id)
                  }
                  isLastItem={index === fundingSources?.length - 1}
                  itemName={formatMessage(MSG.itemName)}
                />
                <FormattedMessage
                  {...MSG.title}
                  values={{
                    counter: index + 1,
                    team: domain?.name,
                    rate: (
                      <div
                        className={classNames(styles.rate, styles.marginLeft)}
                      >
                        <FormattedMessage
                          {...MSG.rate}
                          values={{
                            amount,
                            token: tokenData?.symbol,
                            time,
                            comma:
                              fundingSource.rates.length > 1 && isOpen && ', ',
                          }}
                        />
                      </div>
                    ),
                    tokens:
                      fundingSource.rates.length > 1 &&
                      (isOpen
                        ? fundingSource.rates.map((rateItem, idx) => {
                            if (idx === 0) {
                              return null;
                            }
                            const tokenItemData = colony.tokens?.find(
                              (tokenItem) =>
                                token && tokenItem.address === rateItem.token,
                            );
                            return (
                              <div className={styles.rate} key={rateItem.id}>
                                <FormattedMessage
                                  {...MSG.rate}
                                  values={{
                                    amount: rateItem.amount,
                                    token: tokenItemData?.symbol,
                                    time: rateItem.time,
                                    comma:
                                      fundingSource.rates.length > idx + 1 &&
                                      ',',
                                  }}
                                />
                              </div>
                            );
                          })
                        : '...'),
                  }}
                />
              </div>
            </FormSection>
            <LockedFundingSource
              colony={colony}
              fundingSource={fundingSource}
              isOpen={isOpen}
            />
          </div>
        );
      })}
    </div>
  );
};

LockedStreaming.displayName = displayName;

export default LockedStreaming;

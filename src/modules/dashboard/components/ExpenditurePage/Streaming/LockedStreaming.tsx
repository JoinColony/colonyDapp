import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
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
    defaultMessage: `{counter}: {team}, {rateAmount} {rateToken} / {rateTime} {dots}`,
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

        const { amount, token, time } = fundingSource.rate?.[0] || {};
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
                  isLastitem={index === fundingSources?.length - 1}
                />
                <FormattedMessage
                  {...MSG.title}
                  values={{
                    counter: index + 1,
                    team: domain?.name,
                    rateAmount: amount,
                    rateToken: tokenData?.symbol,
                    rateTime: time,
                    dots: fundingSource.rate.length > 1 && '...',
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

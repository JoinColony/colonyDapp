import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
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
    defaultMessage: '{nr}: {team}, {rateAmount} {rateToken} / {rateTime}',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.LockedStreaming';

interface Props {
  fundingSources?: FundingSource[];
  colony: Colony;
}

const LockedStreaming = ({ fundingSources, colony }: Props) => {
  const [expandedFundingSources, setExpandedFundingSources] = useState<
    number[] | undefined
  >(fundingSources?.map((_, idx) => idx));

  const onToggleButtonClick = useCallback((index) => {
    setExpandedFundingSources((expandedIndexes) => {
      const isOpen = expandedIndexes?.find((expanded) => expanded === index);

      if (isOpen !== undefined) {
        return expandedIndexes?.filter((idx) => idx !== index);
      }
      return [...(expandedIndexes || []), index];
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
        const isOpen =
          expandedFundingSources?.find((idx) => idx === index) !== undefined;

        const { amount, token, time } = fundingSource.rate || {};
        const tokenData = colony.tokens?.find(
          (tokenItem) => token && tokenItem.address === token,
        );

        return (
          <div className={styles.singleFundingSource} key={fundingSource.id}>
            <FormSection>
              <div className={styles.fundingSourceLabel}>
                <CollapseExpandButtons
                  isExpanded={fundingSource.isExpanded}
                  onToogleButtonClick={() => onToggleButtonClick(index)}
                  isLastitem={index === fundingSources?.length - 1}
                />
                <FormattedMessage
                  {...MSG.title}
                  values={{
                    nr: index + 1,
                    team: domain?.name,
                    rateAmount: amount,
                    rateToken: tokenData?.symbol,
                    rateTime: time,
                  }}
                />
              </div>
            </FormSection>
            <LockedFundingSource
              colony={colony}
              index={index}
              fundingSource={{
                ...fundingSource,
                rate: {
                  amount,
                  token: tokenData,
                  time,
                },
              }}
              multipleFundingSources={fundingSources.length > 1}
              isOpen={!!isOpen}
            />
          </div>
        );
      })}
    </div>
  );
};

LockedStreaming.displayName = displayName;

export default LockedStreaming;

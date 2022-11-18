import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import { Colony } from '~data/index';

import { ErrorDot } from '../ErrorDot';
import { CollapseExpandButtons } from '../Payments';

import LockedFundingSource from './LockedFundingSource';
import { FundingSource } from './types';
import useInsufficientFunds from './hooks';
import styles from './Streaming.css';

const displayName = 'dashboard.ExpenditurePage.Streaming.SingleLockedFunding';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ExpenditurePage.Streaming.SingleLockedFunding.title',
    defaultMessage: `{counter}: {team}, {rate} {tokens}`,
  },
  rate: {
    id: 'dashboard.ExpenditurePage.Streaming.SingleLockedFunding.rate',
    defaultMessage: `{amount} {token} / {time}{comma}`,
  },
  titleTooltipError: {
    id: `dashboard.ExpenditurePage.Streaming.SingleLockedFunding.titleTooltipError`,
    defaultMessage: 'Required field error',
  },
});

interface Props {
  fundingSource: FundingSource;
  colony: Colony;
  openItemsIds: string[];
  index: number;
  onToggleButtonClick: any;
  isLastItem?: boolean;
}

const SingleLockedFunding = ({
  fundingSource,
  colony,
  openItemsIds,
  index,
  onToggleButtonClick,
  isLastItem,
}: Props) => {
  const domain = colony?.domains.find(
    ({ ethDomainId }) => Number(fundingSource.team) === ethDomainId,
  );
  const isOpen = !!openItemsIds?.find((id) => id === fundingSource.id);

  const { amount, token, time } = fundingSource.rates?.[0] || {};
  const tokenData = colony.tokens?.find(
    (tokenItem) => token && tokenItem.address === token,
  );

  const { ref, teamsError, tokensError } = useInsufficientFunds();
  const hasError = teamsError?.find(
    (sourceId) => sourceId === fundingSource.team,
  );

  return (
    <div
      className={classNames(styles.singleFundingSource, {
        [styles.marginBottomLarge]: isOpen,
      })}
      key={fundingSource.id}
      data-index={index}
      {...{ ref }}
    >
      <div className={styles.titleRow}>
        <FormSection>
          <div className={styles.fundingSourceLabel}>
            <CollapseExpandButtons
              isExpanded={isOpen}
              onToogleButtonClick={() => onToggleButtonClick(fundingSource.id)}
              isLastItem={isLastItem}
            />
            <FormattedMessage
              {...MSG.title}
              values={{
                counter: index + 1,
                team: domain?.name,
                rate: (
                  <div className={classNames(styles.rate, styles.marginLeft)}>
                    <FormattedMessage
                      {...MSG.rate}
                      values={{
                        amount,
                        token: tokenData?.symbol,
                        time,
                        comma: fundingSource.rates.length > 1 && isOpen && ', ',
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
                                  fundingSource.rates.length > idx + 1 && ',',
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
        {hasError && (
          <ErrorDot
            tooltipContent={<FormattedMessage {...MSG.titleTooltipError} />}
          />
        )}
      </div>
      <LockedFundingSource
        colony={colony}
        fundingSource={fundingSource}
        isOpen={isOpen}
        tokensError={tokensError}
        hasError={!!hasError}
      />
    </div>
  );
};

SingleLockedFunding.displayName = displayName;

export default SingleLockedFunding;

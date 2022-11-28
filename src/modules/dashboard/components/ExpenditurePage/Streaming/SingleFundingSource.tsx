import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';

import { CollapseExpandButtons } from '../Payments';
import { ErrorDot } from '../ErrorDot';

import { Props as StreamingProps } from './Streaming';
import FundingSource from './FundingSource';
import { FundingSource as FundingSourceType } from './types';
import { StreamingErrorsContextProvider } from './StreamingErrorsContext';
import styles from './Streaming.css';

const displayName = 'dashboard.ExpenditurePage.Streaming.SingleFundingSource';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ExpenditurePage.Streaming.SingleFundingSource.title',
    defaultMessage: '{nr}: {team}',
  },
  titleTooltipError: {
    id: `dashboard.ExpenditurePage.Streaming.SingleFundingSource.titleTooltipError`,
    defaultMessage: 'Required field error',
  },
  itemName: {
    id: `dashboard.ExpenditurePage.Streaming.SingleFundingSource.itemName`,
    defaultMessage: 'funding source',
  },
});

interface Props extends StreamingProps {
  fundingSource: FundingSourceType;
  index: number;
  onToggleButtonClick: (index: number) => void;
  remove: (index: number) => void;
  isLastItem?: boolean;
  multipleFundingSources?: boolean;
}

const SingleFundingSource = ({
  fundingSource,
  index,
  onToggleButtonClick,
  remove,
  sidebarRef,
  colony,
  isLastItem,
  multipleFundingSources,
}: Props) => {
  const domain = colony?.domains.find(
    ({ ethDomainId }) => Number(fundingSource.team) === ethDomainId,
  );

  const [ratesWithError, setRatesWithError] = useState<number[]>([]);
  const [limitsWithError, setLimitsWithError] = useState<number[]>([]);
  const hasError = useMemo(
    () => !isEmpty(ratesWithError) || !isEmpty(limitsWithError),
    [limitsWithError, ratesWithError],
  );

  const { formatMessage } = useIntl();

  const streamingContextValue = useMemo(
    () => ({
      setRatesWithError,
      setLimitsWithError,
    }),
    [],
  );

  return (
    <StreamingErrorsContextProvider value={streamingContextValue}>
      <div
        className={classNames(styles.singleFundingSource, {
          [styles.wrapper]: !isLastItem && fundingSource.isExpanded,
        })}
      >
        <FormSection>
          <div className={styles.fundingSourceLabel}>
            <CollapseExpandButtons
              isExpanded={fundingSource.isExpanded}
              onToogleButtonClick={() => onToggleButtonClick(index)}
              isLastItem={isLastItem}
              itemName={formatMessage(MSG.itemName)}
            />
            <p className={styles.fundingTitle}>
              <FormattedMessage
                {...MSG.title}
                values={{ nr: index + 1, team: domain?.name }}
              />
            </p>
            {multipleFundingSources && (
              <Icon
                name="trash"
                className={styles.deleteIcon}
                onClick={() => remove(index)}
              />
            )}
            {hasError && (
              <ErrorDot
                tooltipContent={<FormattedMessage {...MSG.titleTooltipError} />}
              />
            )}
          </div>
        </FormSection>
        <FundingSource
          sidebarRef={sidebarRef}
          colony={colony}
          index={index}
          fundingSource={fundingSource}
        />
      </div>
    </StreamingErrorsContextProvider>
  );
};

SingleFundingSource.displayName = displayName;

export default SingleFundingSource;

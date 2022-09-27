import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection } from '~core/Fields';
import Icon from '~core/Icon';

import { CollapseExpandButtons } from '../Payments';
import FundingSource from './FundingSource';

import { Props as StreamingProps } from './Streaming';
import { FundingSource as FundingSourceType } from './types';
import styles from './Streaming.css';
import useErrorFundingSourceField from './FundingSource/useErrorFundingSourceField';
import { ErrorDot } from '../ErrorDot';

const displayName = 'dashboard.ExpenditurePage.SingleFundingSource';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ExpenditurePage.Streaming.title',
    defaultMessage: '{nr}: {team}',
  },
});

interface Props extends StreamingProps {
  allFundingSources: FundingSourceType[];
  fundingSource: FundingSourceType;
  index: number;
  onToggleButtonClick: (index: number) => void;
  remove: (index: number) => void;
}

const SingleFundingSource = ({
  allFundingSources: fundingSources,
  fundingSource,
  index,
  onToggleButtonClick,
  remove,
  sidebarRef,
  colony,
}: Props) => {
  const domain = colony?.domains.find(
    ({ ethDomainId }) => Number(fundingSource.team) === ethDomainId,
  );
  const hasErrorFields = useErrorFundingSourceField(fundingSource, index);

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
            values={{ nr: index + 1, team: domain?.name }}
          />
          {fundingSources?.length > 1 && (
            <Icon
              name="trash"
              className={styles.deleteIcon}
              onClick={() => remove(index)}
            />
          )}
          {hasErrorFields && (
            <ErrorDot tooltipContent="Required fields error" />
          )}
        </div>
      </FormSection>
      <FundingSource
        sidebarRef={sidebarRef}
        colony={colony}
        index={index}
        fundingSource={fundingSource}
        isLast={index === fundingSources?.length - 1}
      />
    </div>
  );
};

SingleFundingSource.displayName = displayName;

export default SingleFundingSource;

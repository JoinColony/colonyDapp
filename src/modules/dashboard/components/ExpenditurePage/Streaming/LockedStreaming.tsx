import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { Colony } from '~data/index';
import Icon from '~core/Icon';

import { Stage } from '../Stages/constants';

import { FundingSource } from './types';
import SingleLockedFunding from './SingleLockedFunding';
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
  activeStageId?: string;
  editForm: () => void;
}

const LockedStreaming = ({
  fundingSources,
  colony,
  activeStageId,
  editForm,
}: Props) => {
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
      <div className={classNames(styles.header, styles.headerLocked)}>
        <FormattedMessage {...MSG.fundingSource} />
        {activeStageId !== Stage.Claimed && (
          <span className={styles.editIcon}>
            <Icon
              name="edit"
              appearance={{ size: 'medium' }}
              title="Edit expenditure"
              onClick={editForm}
            />
          </span>
        )}
      </div>
      {fundingSources?.map((fundingSource, index) => (
        <SingleLockedFunding
          {...{
            fundingSource,
            colony,
            openItemsIds,
            index,
            onToggleButtonClick,
          }}
          isLastItem={index === fundingSources?.length - 1}
        />
      ))}
    </div>
  );
};

LockedStreaming.displayName = displayName;

export default LockedStreaming;

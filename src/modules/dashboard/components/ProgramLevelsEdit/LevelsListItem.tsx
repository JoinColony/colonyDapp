import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import { OneLevel } from '~data/index';

import styles from './LevelsListItem.css';

const MSG = defineMessages({
  dragHandleTitle: {
    id: 'dashboard.LevelsList.dragHandleTitle',
    defaultMessage: 'Click, hold, and drag to re-order levels.',
  },
  linkView: {
    id: 'dashboard.LevelsList.linkView',
    defaultMessage: 'View',
  },
  untitledLevel: {
    id: 'dashboard.LevelsList.untitledLevel',
    defaultMessage: 'Untitled Level',
  },
});

interface Props {
  colonyName: string;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  level: OneLevel;
  programId: string;
}

const displayName = 'dashboard.ProgramLevelsEdit.LevelsListItem';

const LevelsListItem = ({
  colonyName,
  dragHandleProps,
  level: { id: levelId, title },
  programId,
}: Props) => {
  const levelUrl = `/colony/${colonyName}/program/${programId}/level/${levelId}`;
  return (
    <div className={styles.listItemInner}>
      <div className={styles.dragHandleContainer}>
        <div {...dragHandleProps}>
          <Icon
            className={styles.dragHandleIcon}
            name="drag-handle"
            title={MSG.dragHandleTitle}
          />
        </div>
      </div>
      {/* @todo Add level achievement here */}
      <div className={styles.itemContentContainer}>
        <Heading
          appearance={{ margin: 'none', size: 'medium' }}
          text={title || MSG.untitledLevel}
        />
      </div>
      <div className={styles.itemActionContainer}>
        <Button linkTo={levelUrl} text={MSG.linkView} />
      </div>
    </div>
  );
};

LevelsListItem.displayName = displayName;

export default LevelsListItem;

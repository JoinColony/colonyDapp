import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';

import styles from './EditLevels.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.EditLevels.title',
    defaultMessage: 'Levels',
  },
  description: {
    id: 'dashboard.EditLevels.description',
    defaultMessage: `Levels must be completed in order. Subsequent levels are locked until the previous level is completed.`,
  },
  buttonAddLevel: {
    id: 'dashboard.EditLevels.buttonAddLevel',
    defaultMessage: 'Add level',
  },
});

const displayName = 'dashboard.EditLevels';

const EditLevels = () => {
  const handleAddLevel = useCallback(() => {}, []);
  return (
    <div>
      <Heading appearance={{ size: 'medium' }} text={MSG.title} />
      <Heading
        appearance={{ size: 'normal', weight: 'thin' }}
        text={MSG.description}
      />
      <Button appearance={{ theme: 'dottedArea' }} onClick={handleAddLevel}>
        <span className={styles.buttonTextContainer}>
          <div className={styles.buttonIcon}>
            <Icon
              appearance={{ size: 'medium' }}
              name="circle-plus"
              title={MSG.buttonAddLevel}
            />
          </div>
          <FormattedMessage {...MSG.buttonAddLevel} />
        </span>
      </Button>
    </div>
  );
};

EditLevels.displayName = displayName;

export default EditLevels;

import React, { MouseEvent, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './NewTaskButton.css';

const MSG = defineMessages({
  newTask: {
    id: 'dashboard.ColonyTasks.newTask',
    defaultMessage: 'Create a new task',
  },
  newTaskDescription: {
    id: 'dashboard.ColonyTasks.newTaskDescription',
    defaultMessage: 'Create a new task',
  },
  creatingTask: {
    id: 'dashboard.ColonyTasks.creatingTask',
    defaultMessage: 'Creating your task...',
  },
});

interface Props {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  loading: boolean;
}

const displayName = 'dashboard.ColonyTasks.NewTaskButton';

const NewTaskButton = ({ onClick, disabled, loading }: Props) => {
  const [iconName, setIconName] = useState('empty-task');

  if (disabled) {
    return null;
  }
  if (loading) {
    return (
      <div className={styles.newTaskSpinnerContainer}>
        <SpinnerLoader
          appearance={{ theme: 'primary', size: 'massive' }}
          loadingText={MSG.creatingTask}
        />
      </div>
    );
  }
  return (
    /*
     * Ordinarily this wouldn't be necessary, but we can't use <button>
     * because of the style requirements.
     */
    <button
      type="button"
      onClick={onClick}
      className={styles.newTaskButtonContainer}
    >
      <Icon
        className={styles.newTaskButton}
        name={iconName}
        onMouseEnter={() => setIconName('active-task')}
        onMouseLeave={() => setIconName('empty-task')}
        title={MSG.newTask}
        viewBox="0 0 132 132"
      />
      <FormattedMessage tagName="p" {...MSG.newTaskDescription} />
    </button>
  );
};

NewTaskButton.displayName = displayName;

export default NewTaskButton;

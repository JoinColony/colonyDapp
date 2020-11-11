import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';
import styles from './ColonyActionsDialogItem.css';

interface Props {
  title: object;
  description: object;
  disabled?: boolean;
}

const MSG = defineMessages({
  coming: {
    id: 'dashboard.ColonyActionsDialog.ColonyActionsDialogItem.coming',
    defaultMessage: 'Coming',
  },
});

const ColonyActionsDialogItem = ({ title, description, disabled }: Props) => {
  return (
    <div className={`${disabled ? styles.disabled : styles.content}`}>
      <div>
        <Paragraph className={styles.title}>
          <Icon
            appearance={{ size: 'medium' }}
            name="caret-right"
            title={title}
          />
          <FormattedMessage {...title} />
          {disabled && (
            <span className={styles.coming}>
              <FormattedMessage {...MSG.coming} />
            </span>
          )}
        </Paragraph>
        <Paragraph className={styles.description}>
          <FormattedMessage {...description} />
        </Paragraph>
      </div>
      {!disabled && (
        <div className={styles.icon}>
          <Icon
            appearance={{ size: 'medium' }}
            name="caret-right"
            title={title}
          />
        </div>
      )}
    </div>
  );
};

export default ColonyActionsDialogItem;

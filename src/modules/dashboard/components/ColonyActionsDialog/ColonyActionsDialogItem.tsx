import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';
import styles from './ColonyActionsDialogItem.css';

interface Props {
  title: object;
  description: object;
  disabled?: boolean;
  icon: string;
}

const MSG = defineMessages({
  coming: {
    id: 'dashboard.ColonyActionsDialog.ColonyActionsDialogItem.coming',
    defaultMessage: 'Coming',
  },
});

const ColonyActionsDialogItem = ({
  title,
  description,
  disabled,
  icon,
}: Props) => {
  return (
    <div className={`${disabled ? styles.disabled : styles.content}`}>
      <div>
        <Paragraph className={styles.title}>
          <span className={styles.iconTitle}>
            <Icon appearance={{ size: 'small' }} name={icon} title={title} />
          </span>
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
        <div className={styles.iconCaret}>
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

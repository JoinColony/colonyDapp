import React from 'react';
import Icon from '~core/Icon';
import { FormattedMessage, defineMessages } from 'react-intl';
import Paragraph from '~core/Paragraph';
import styles from './ColonyActionsItem.css';

interface Props {
  title: object;
  description: object;
  disabled?: boolean;
}

const MSG = defineMessages({
  coming: {
    id: 'dashboard.ColonyHomeActions.ColonyActionsItem.coming',
    defaultMessage: 'Coming',
  }
});

const ColonyActionsItem = ({
  title,
  description,
  disabled,
}: Props) => {

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
            <Paragraph className={styles.coming}><FormattedMessage {...MSG.coming} /></Paragraph>
          )}
        </Paragraph>
        <Paragraph className={styles.description}><FormattedMessage {...description} /></Paragraph>
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

export default ColonyActionsItem;

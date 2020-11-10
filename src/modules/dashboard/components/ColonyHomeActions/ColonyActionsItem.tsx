import React from 'react';
import Icon from '~core/Icon';
import { FormattedMessage } from 'react-intl';
import Paragraph from '~core/Paragraph';
import styles from './ColonyActionsItem.css';

interface Props {
  title: object;
  description: object;

}

const ColonyActionsItem = ({
  title,
  description
}: Props) => {

  return (
    <div className={styles.content}>
      <div>
        <Paragraph className={styles.title}>
          <Icon
            appearance={{ size: 'medium' }}
            name="caret-right"
            title={title}
          />
          <FormattedMessage {...title} />
        </Paragraph>
        <Paragraph className={styles.description}><FormattedMessage {...description} /></Paragraph>
      </div>
      <div className={styles.icon}>
        <Icon
          appearance={{ size: 'medium' }}
          name="caret-right"
          title={title}
        />
      </div>
    </div>
  );
};

export default ColonyActionsItem;

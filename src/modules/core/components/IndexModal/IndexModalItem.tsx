import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';
import styles from './IndexModalItem.css';

interface Props {
  title: object;
  description: object;
  comingSoon?: boolean;
  icon: string;
  onClick?: () => void;
}

const MSG = defineMessages({
  coming: {
    id: 'core.IndexModal.IndexModalItem.coming',
    defaultMessage: 'Coming soon',
  },
});

const IndexModalItem = ({
  title,
  description,
  icon,
  onClick,
  comingSoon,
}: Props) => {
  return (
    <div className={`${comingSoon ? styles.disabled : styles.content}`} onClick={onClick}>
      <div>
        <Paragraph className={styles.title}>
          <span className={styles.iconTitle}>
            <Icon appearance={{ size: 'small' }} name={icon} title={title} />
          </span>
          <FormattedMessage {...title} />
          {comingSoon && (
            <span className={styles.coming}>
              <FormattedMessage {...MSG.coming} />
            </span>
          )}
        </Paragraph>
        <Paragraph className={styles.description}>
          <FormattedMessage {...description} />
        </Paragraph>
      </div>
      {!comingSoon && (
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

export default IndexModalItem;

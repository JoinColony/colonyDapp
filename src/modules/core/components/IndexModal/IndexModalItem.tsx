import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';

import { getMainClasses } from '~utils/css';
import { ItemShape } from './IndexModal';

import styles from './IndexModalItem.css';


interface Props {
  item: ItemShape;
}

const MSG = defineMessages({
  coming: {
    id: 'core.IndexModal.IndexModalItem.coming',
    defaultMessage: 'Coming soon',
  },
});

const IndexModalItem = ({
  item: {
    title,
    description,
    icon,
    onClick,
    comingSoon = false,
    permissionRequired = false,
    permissionInfoText,
    permissionInfoTextValues,
  },
}: Props) => {
  return (
    <div
      className={getMainClasses({}, styles, { disabled: !!comingSoon })}
      onClick={onClick}
      role="button"
      onKeyPress={onClick}
      tabIndex={0}
    >
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
      {!comingSoon && permissionRequired && (
        <div className={styles.iconWarning}>
          <Icon
            appearance={{ size: 'medium' }}
            name="triangle-warning"
            title={title}
          />
        </div>
      )}
      {!comingSoon && !permissionRequired && (
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

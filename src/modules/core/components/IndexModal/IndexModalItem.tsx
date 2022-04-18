import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import Paragraph from '~core/Paragraph';
import { Tooltip } from '~core/Popover';

import { getMainClasses } from '~utils/css';
import { ItemShape } from './IndexModal';

import styles from './IndexModalItem.css';

interface Props {
  item: ItemShape;
}

const MSG = defineMessages({
  coming: {
    id: 'IndexModal.IndexModalItem.coming',
    defaultMessage: 'Coming soon',
  },
  permissionsMessageFallback: {
    id: 'IndexModal.IndexModalItem.permissionsMessageFallback',
    defaultMessage: `You must have the required permissions in the
      relevant teams, in order to take this action`,
  },
});

const displayName = 'IndexModal.IndexModalItem';

const IndexModalItem = ({
  item: {
    title,
    description,
    icon,
    onClick,
    comingSoon = false,
    disabled = false,
    permissionRequired = false,
    permissionInfoText = MSG.permissionsMessageFallback,
    permissionInfoTextValues,
    dataTest,
  },
}: Props) => {
  const triggerOnClick = useCallback(() => {
    if (!disabled && !comingSoon && !permissionRequired && onClick) {
      return onClick();
    }
    return null;
  }, [disabled, comingSoon, permissionRequired, onClick]);

  return (
    <div
      className={getMainClasses({}, styles, {
        disabled: !!comingSoon || !!disabled,
      })}
      onClick={triggerOnClick}
      role="button"
      onKeyPress={triggerOnClick}
      tabIndex={0}
      data-test={dataTest}
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
      {(!comingSoon || !disabled) && permissionRequired && (
        <Tooltip
          /*
           * @NOTE About tooltip placement
           *
           * Due to the way the core Dialog styles apply position: relative, it
           * will always "force" the tooltip to render inside the bounds of the
           * dialog itself.
           *
           * This means that even if the tooltip is set to render to the right of
           * the element, if it exceeds the bounds of the dialog, like in this case,
           * it will be forced to be re-rendered to the left.
           *
           * This is a limitation of our current Dialog core component, and we'll
           * need some heavy duty refactoring in order to make it play nicely with
           * the Popover / Tooltip component.
           */
          placement="right"
          trigger="hover"
          content={
            <div className={styles.tooltip}>
              <FormattedMessage
                {...permissionInfoText}
                values={permissionInfoTextValues}
              />
            </div>
          }
        >
          <div className={styles.iconWarning}>
            <Icon name="triangle-warning" title={title} />
          </div>
        </Tooltip>
      )}
      {!comingSoon && !permissionRequired && !disabled && (
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

IndexModalItem.displayName = displayName;

export default IndexModalItem;

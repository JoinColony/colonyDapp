import React, { ReactNode, useState, useCallback } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import styles from './Card.css';

interface Props {
  /** Card child content to render */
  children: ReactNode;

  /** Optional additional class name for further styling */
  className?: string;

  /** Shows a popover in the top right corner with some help text */
  help?: string | MessageDescriptor;

  /** Whether or not the card should be dismissable. If `true`, will add close icon in top right corner. */
  isDismissible?: boolean;

  /** Render as a list item (`<li>`) */
  listItem?: boolean;
}

const displayName = 'Card';

const Card = ({
  children,
  className,
  help,
  isDismissible = false,
  listItem,
  ...rest
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClose = useCallback(() => {
    if (!isDismissible) return;
    setIsOpen(false);
  }, [isDismissible]);

  if (!isOpen) return null;

  const mainClass = styles.main;
  const classNames = className ? `${mainClass} ${className}` : mainClass;

  const ElementTag = listItem ? 'li' : 'div';

  return (
    <ElementTag className={classNames} {...rest}>
      {isDismissible && (
        <button
          className={styles.closeButton}
          onClick={handleClose}
          type="button"
        >
          <Icon
            appearance={{ size: 'normal' }}
            name="close"
            title={{ id: 'button.close' }}
          />
        </button>
      )}
      {help && (
        <span className={styles.help}>
          <Tooltip
            content={
              typeof help == 'string' ? help : <FormattedMessage {...help} />
            }
          >
            <Icon
              appearance={{ size: 'normal' }}
              name="question-mark"
              title=""
            />
          </Tooltip>
        </span>
      )}
      {children}
    </ElementTag>
  );
};

Card.displayName = displayName;

export default Card;

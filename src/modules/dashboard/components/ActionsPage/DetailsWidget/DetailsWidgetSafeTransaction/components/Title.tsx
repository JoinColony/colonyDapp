import React from 'react';
import classnames from 'classnames';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../DetailsWidgetSafeTransaction.css';

interface TitleProps {
  index: number | null;
  title: MessageDescriptor;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Title = ({ index, title, isOpen, setIsOpen }: TitleProps) => (
  <div className={classnames(widgetStyles.item, styles.title)}>
    <div className={widgetStyles.label}>
      {index && `${index}. `}
      <FormattedMessage {...title} />
    </div>
    <div className={widgetStyles.value}>
      <Icon
        name={isOpen ? 'caret-up' : 'caret-down'}
        appearance={{ size: 'extraTiny' }}
        onClick={() => setIsOpen((val) => !val)}
      />
    </div>
  </div>
);

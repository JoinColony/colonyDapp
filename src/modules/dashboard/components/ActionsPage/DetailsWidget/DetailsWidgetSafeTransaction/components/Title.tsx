import React from 'react';
import classnames from 'classnames';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '~core/Icon';
import Tag from '~core/Tag';
import { TRANSACTION_STATUS } from '~utils/safes/getTransactionStatuses';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../DetailsWidgetSafeTransaction.css';

interface TitleProps {
  index: number | null;
  title: MessageDescriptor;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionStatus: string;
}

export const Title = ({
  index,
  title,
  isOpen,
  setIsOpen,
  transactionStatus,
}: TitleProps) => (
  <div className={classnames(widgetStyles.item, styles.title)}>
    <div className={widgetStyles.label}>
      {index && `${index}. `}
      <FormattedMessage {...title} />
      <div className={styles.transactionTag}>
        <Tag
          text={transactionStatus}
          appearance={{
            theme:
              transactionStatus === TRANSACTION_STATUS.PENDING
                ? 'golden'
                : 'primary',
            colorSchema: 'fullColor',
          }}
        />
      </div>
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

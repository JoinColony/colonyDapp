import React from 'react';
import { MessageDescriptor, FormattedMessage } from 'react-intl';

import Dialog, { DialogProps } from '~core/Dialog';
import Heading from '~core/Heading';
import styles from './IndexModal.css';
import IndexModalItem from './IndexModalItem';
import Button from '~core/Button';
import Icon from '~core/Icon';

const displayName = 'core.IndexModal';

interface Items {
  title: MessageDescriptor;
  description: MessageDescriptor;
  icon: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

interface Props extends DialogProps {
  items: Items[];
  title: MessageDescriptor;
  back?: () => void;
}

const IndexModal = ({ title, cancel, items, back }: Props) => {
  return (
    <Dialog cancel={cancel}>
      <div className={styles.header}>
        <Heading
          appearance={{
            margin: 'none',
            size: 'medium',
            weight: 'bold',
            theme: 'dark',
          }}
          text={title}
        />
      </div>
      <div className={styles.content}>
        {items.map((item) => (
          <IndexModalItem {...item} key={item.icon} />
        ))}
        {back && (
          <Button
            appearance={{ theme: 'secondary' }}
            onClick={back}
            className={styles.backButton}
          >
            <Icon
              appearance={{ size: 'normal' }}
              name="caret-left"
              title={{ id: 'button.back' }}
            />
            <FormattedMessage id="button.back" />
          </Button>
        )}
      </div>
    </Dialog>
  );
};

IndexModal.displayName = displayName;

export default IndexModal;

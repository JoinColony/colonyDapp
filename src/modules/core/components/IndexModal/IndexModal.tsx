import React from 'react';
import { MessageDescriptor } from 'react-intl';

import Dialog, { DialogProps } from '~core/Dialog';
import Heading from '~core/Heading';
import styles from './IndexModal.css';
import IndexModalItem from './IndexModalItem';

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

const IndexModal = ({ title, cancel, items }: Props) => {
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
        {items.map(item => (
          <IndexModalItem
            {...item}
            key={item.icon}
          />
        ))}
      </div>
    </Dialog>
  );
};

IndexModal.displayName = displayName;

export default IndexModal;

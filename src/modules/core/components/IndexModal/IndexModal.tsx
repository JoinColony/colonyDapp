import React from 'react';
import { MessageDescriptor } from 'react-intl';

import Dialog, { DialogProps } from '~core/Dialog';
import Heading from '~core/Heading';
import styles from './IndexModal.css';

const displayName = 'core.IndexModal';

interface Items {
  title: MessageDescriptor,
  description: MessageDescriptor,
  icon: string,
  comingSoon?: boolean,
  onClick?: () => void;
}

interface Props extends DialogProps {
  items: Items[];
  title: string;
  back?: () => void;
}

const IndexModal = ({ title, cancel }: Props) => {
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
      </div>
    </Dialog>
  );
};

IndexModal.displayName = displayName;

export default IndexModal;

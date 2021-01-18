import React from 'react';
import { defineMessages } from 'react-intl';

import Button, { Props as DefaultButtonProps } from '~core/Button';

import styles from './LoadMoreButton.css';

const MSG = defineMessages({
  label: {
    id: 'LoadMoreButton.label',
    defaultMessage: 'Load More',
  },
});

interface Props extends DefaultButtonProps {
  isLoadingData: boolean;
}

const LoadMoreButton = ({ isLoadingData, ...props }: Props) => (
  <div className={styles.loadMoreButton}>
    <Button
      appearance={{ size: 'medium', theme: 'primary' }}
      text={MSG.label}
      loading={isLoadingData}
      {...props}
    />
  </div>
);

export default LoadMoreButton;

import React, { ReactNode, useEffect, useState } from 'react';
import { MessageDescriptor, defineMessages, useIntl } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';

import NakedMole from '../../../../img/naked-mole-without-bg.svg';
import styles from './LoadingTemplate.css';

interface Props {
  children?: ReactNode;
  loadingText?: string | MessageDescriptor;
}

const MSG = defineMessages({
  loadingDelayed: {
    id: 'pages.LoadingTemplate.loadingDelayed',
    defaultMessage: `As you can see, it's taking a while to connect to the service.`,
  },

  loadingDelayedDescription: {
    id: 'pages.LoadingTemplate.loadingDelayedDescription',
    defaultMessage: `Please hold tight while we keep trying. Sorry, we know this is boring.`,
  },

  loadingFailed: {
    id: 'pages.LoadingTemplate.loadingFailed',
    defaultMessage: `Oh noes! We tried and tried but
                      couldn't get any response from the service.`,
  },

  loadingFailedDescription: {
    id: 'pages.LoadingTemplate.loadingFailedDescription',
    defaultMessage: `We're probably already trying to fix this, so please try again later.`,
  },
});

const delayedLoadingDuration = 15 * 1000; // 15 seconds
const failedLoadingDuration = 30 * 1000; // 30 seconds

const LoadingTemplate = ({ children, loadingText }: Props) => {
  type LoadingStateType = 'default' | 'delayed' | 'failed';
  const [loadingState, setLoadingState] = useState<LoadingStateType>('default');

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setLoadingState('delayed');
    }, delayedLoadingDuration);
    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    const failedTimer = setTimeout(() => {
      setLoadingState('failed');
    }, failedLoadingDuration);
    return () => clearTimeout(failedTimer);
  }, []);

  const { formatMessage } = useIntl();

  return (
    <div className={styles.main}>
      <main className={styles.mainContent}>
        {loadingState !== 'failed' && (
          <div>
            <div className={styles.loaderContainer}>
              <SpinnerLoader
                loadingText={loadingText}
                appearance={{ theme: 'primary', size: 'massive' }}
              />
            </div>
            {children}
          </div>
        )}

        {loadingState === 'failed' && (
          <div className={styles.loaderContainer}>
            <div className={styles.nakedMole}>
              <NakedMole />
            </div>
          </div>
        )}

        {loadingState !== 'default' && (
          <div>
            <div className={styles.loadingDelayedOrFailed}>
              <p>
                {loadingState === 'delayed'
                  ? formatMessage(MSG.loadingDelayed)
                  : formatMessage(MSG.loadingFailed)}
              </p>
              <div className={styles.loadingDelayedOrFailedDetail}>
                <p>
                  {loadingState === 'delayed'
                    ? formatMessage(MSG.loadingDelayedDescription)
                    : formatMessage(MSG.loadingFailedDescription)}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoadingTemplate;
